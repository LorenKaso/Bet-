from typing import Any, cast

import bleach

from database import get_db_connection
from fastapi import Cookie, FastAPI, HTTPException, Request, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import (
        BaseModel,
        Field,
        model_validator,
    )
from routes.password_reset import router as password_reset_router
from routes.auth import router as auth_router


ALLOWED_POST_TAGS = [
    "p",
    "strong",
    "b",
    "em",
    "i",
    "a",
    "br",
]

ALLOWED_POST_ATTRIBUTES = {
    "a": ["href"],
}

ALLOWED_POST_PROTOCOLS = [
    "http",
    "https",
]


def sanitize_post_content(content: str | None) -> str | None:
    if content is None:
        return None

    return bleach.clean(
        content,
        tags=ALLOWED_POST_TAGS,
        attributes=ALLOWED_POST_ATTRIBUTES,
        protocols=ALLOWED_POST_PROTOCOLS,
        strip=True,
    )


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "Backend is running"}


class PostCreateRequest(BaseModel):
    title: str | None = Field(default=None, max_length=255)
    content: str | None = None
    image_url: str | None = Field(default=None, max_length=500)

    @model_validator(mode="after")
    def validate_post(self):
        title = self.title.strip() if self.title else ""
        content = self.content.strip() if self.content else ""
        image_url = self.image_url.strip() if self.image_url else ""

        if not title and not content and not image_url:
            raise ValueError(
                "Post must contain a title, body, or image"
            )

        self.title = title or None
        self.content = content or None
        self.image_url = image_url or None

        return self


@app.post("/posts")
def create_post(
    post: PostCreateRequest,
    session_id: str | None = Cookie(default=None),
):
    if session_id is None:
        raise HTTPException(
            status_code=401,
            detail="Not authenticated",
        )

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT user_id
        FROM sessions
        WHERE session_id = %s
        AND expires_at > NOW()
        """,
        (session_id,),
    )

    session = cast(
        dict[str, int] | None,
        cursor.fetchone(),
    )
    cursor.close()
    connection.close()

    if session is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired session",
        )

    user_id = session["user_id"]

    connection = get_db_connection()
    cursor = connection.cursor()
    safe_content = sanitize_post_content(post.content)
    cursor.execute(
        """
        INSERT INTO posts (user_id, title, content, image_url)
        VALUES (%s, %s, %s, %s)
        """,
        (
            user_id,
            post.title,
            safe_content,
            post.image_url,
        ),
    )

    connection.commit()

    post_id = cursor.lastrowid

    cursor.close()
    connection.close()

    return {
        "message": "Post created successfully",
        "post_id": post_id,
    }


@app.get("/posts")
def get_posts(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=50),
):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        offset = (page - 1) * limit

        cursor.execute("""
            SELECT
                posts.id,
                posts.title,
                posts.content,
                posts.image_url,
                posts.created_at,
                users.id AS user_id,
                users.username,
                users.profile_image
            FROM posts
            JOIN users
                ON posts.user_id = users.id
            ORDER BY posts.created_at DESC
            LIMIT %s OFFSET %s
        """, (limit, offset))

        posts = cursor.fetchall()

        return {
            "posts": posts
        }

    finally:
        cursor.close()
        connection.close()


@app.get("/users/me")
def get_current_user(request: Request):
    session_id = request.cookies.get("session_id")

    if session_id is None:
        raise HTTPException(
            status_code=401,
            detail="Not authenticated",
        )

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(
            """
            SELECT
                users.id,
                users.name,
                users.username,
                users.email
            FROM sessions
            JOIN users
                ON sessions.user_id = users.id
            WHERE sessions.session_id = %s
              AND sessions.expires_at > NOW()
            """,
            (session_id,),
        )

        user = cast(
            dict[str, object] | None,
            cursor.fetchone(),
        )

        if user is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid or expired session",
            )

        return {
            "user": user
        }

    finally:
        cursor.close()
        connection.close()


@app.get("/users/search")
def search_users(q: str = ""):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        search_value = f"%{q.strip()}%"

        cursor.execute(
            """
            SELECT
                id,
                name,
                username,
                profile_image
            FROM users
            WHERE username LIKE %s
            ORDER BY username ASC
            LIMIT 20
            """,
            (search_value,),
        )

        users = cursor.fetchall()

        return {
            "users": users,
        }

    finally:
        cursor.close()
        connection.close()


@app.get("/users/{username}")
def get_user_profile(username: str, request: Request):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT
            id,
            name,
            username,
            bio,
            profile_image
        FROM users
        WHERE username = %s
        """,
        (username,),
    )

    user = cast(
        dict[str, object] | None,
        cursor.fetchone(),
    )

    if user is None:
        cursor.close()
        connection.close()
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    user_id = cast(int, user["id"])

    # Get this user's posts
    cursor.execute(
        """
        SELECT
            id,
            title,
            content,
            image_url,
            created_at
        FROM posts
        WHERE user_id = %s
        ORDER BY created_at DESC
        """,
        (user_id,),
    )

    posts = cursor.fetchall()

    # Count followers
    cursor.execute(
        """
        SELECT COUNT(*) AS followers_count
        FROM followers
        WHERE following_id = %s
        """,
        (user_id,),
    )

    followers_result = cast(
        dict[str, object] | None,
        cursor.fetchone(),
    )

    followers_count = (
        cast(int, followers_result["followers_count"])
        if followers_result
        else 0
    )

    # Count following
    cursor.execute(
        """
        SELECT COUNT(*) AS following_count
        FROM followers
        WHERE follower_id = %s
        """,
        (user_id,),
    )

    following_result = cast(
        dict[str, object] | None,
        cursor.fetchone(),
    )

    following_count = (
        cast(int, following_result["following_count"])
        if following_result
        else 0
    )

    # Check if the logged-in user follows this profile
    is_following = False

    session_id = request.cookies.get("session_id")

    if session_id is not None:
        cursor.execute(
            """
            SELECT user_id
            FROM sessions
            WHERE session_id = %s
              AND expires_at > NOW()
            """,
            (session_id,),
        )

        session = cast(
            dict[str, object] | None,
            cursor.fetchone(),
        )

        if session is not None:
            logged_in_user_id = cast(
                int,
                session["user_id"],
            )

            cursor.execute(
                """
                SELECT 1
                FROM followers
                WHERE follower_id = %s
                  AND following_id = %s
                """,
                (
                    logged_in_user_id,
                    user_id,
                ),
            )

            is_following = cursor.fetchone() is not None

    cursor.close()
    connection.close()

    return {
        "user": {
            "id": user_id,
            "name": user["name"],
            "username": user["username"],
            "bio": user["bio"],
            "profile_image": user["profile_image"],
        },
        "posts": posts,
        "followers_count": followers_count,
        "following_count": following_count,
        "is_following": is_following,
    }


@app.get("/profile/{username}")
def get_profile(username: str):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(
            """
            SELECT id, name, username
            FROM users
            WHERE username = %s
            """,
            (username,),
        )

        user = cast(
            dict[str, object] | None,
            cursor.fetchone(),
        )

        if user is None:
            raise HTTPException(
                status_code=404,
                detail="User not found",
            )

        user_id = cast(int, user["id"])

        cursor.execute(
            """
            SELECT id, content, image_url, created_at
            FROM posts
            WHERE user_id = %s
            ORDER BY created_at DESC
            """,
            (user_id,),
        )

        posts = cursor.fetchall()

        return {
            "user": {
                "id": user_id,
                "name": user["name"],
                "username": user["username"],
            },
            "posts": posts,
        }

    finally:
        cursor.close()
        connection.close()


@app.post("/users/{username}/follow")
def follow_user(username: str, request: Request):
    session_id = request.cookies.get("session_id")

    if session_id is None:
        raise HTTPException(
            status_code=401,
            detail="Not authenticated",
        )

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        # Find the logged-in user from the session
        cursor.execute(
            """
            SELECT user_id
            FROM sessions
            WHERE session_id = %s
              AND expires_at > NOW()
            """,
            (session_id,),
        )

        session = cast(
            dict[str, object] | None,
            cursor.fetchone(),
        )

        if session is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid or expired session",
            )

        follower_id = cast(int, session["user_id"])

        # Find the user we want to follow
        cursor.execute(
            """
            SELECT id
            FROM users
            WHERE username = %s
            """,
            (username,),
        )

        target_user = cast(
            dict[str, object] | None,
            cursor.fetchone(),
        )

        if target_user is None:
            raise HTTPException(
                status_code=404,
                detail="User not found",
            )

        following_id = cast(int, target_user["id"])

        # A user cannot follow themselves
        if follower_id == following_id:
            raise HTTPException(
                status_code=400,
                detail="You cannot follow yourself",
            )

        # Check if the follow relationship already exists
        cursor.execute(
            """
            SELECT follower_id
            FROM followers
            WHERE follower_id = %s
              AND following_id = %s
            """,
            (follower_id, following_id),
        )

        existing_follow = cursor.fetchone()

        if existing_follow is not None:
            raise HTTPException(
                status_code=409,
                detail="You already follow this user",
            )

        # Create the follow relationship
        cursor.execute(
            """
            INSERT INTO followers (
                follower_id,
                following_id
            )
            VALUES (%s, %s)
            """,
            (follower_id, following_id),
        )

        connection.commit()

        return {
            "message": "Follow successful",
            "follower_id": follower_id,
            "following_id": following_id,
        }

    finally:
        cursor.close()
        connection.close()


class UpdateProfileRequest(BaseModel):
    name: str = Field(min_length=1, max_length=50)
    username: str = Field(min_length=3, max_length=50)
    bio: str | None = Field(default=None, max_length=150)
    profile_image: str | None = None


@app.patch("/users/me")
def update_profile(data: UpdateProfileRequest, request: Request):
    session_id = request.cookies.get("session_id")

    if session_id is None:
        raise HTTPException(
            status_code=401,
            detail="Not authenticated",
        )

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(
            """
            SELECT user_id
            FROM sessions
            WHERE session_id = %s
              AND expires_at > NOW()
            """,
            (session_id,),
        )

        session = cast(
            dict[str, object] | None,
            cursor.fetchone(),
        )

        if session is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid or expired session",
            )

        user_id = cast(int, session["user_id"])

        cursor.execute(
            """
            SELECT id
            FROM users
            WHERE username = %s
              AND id != %s
            """,
            (data.username, user_id),
        )

        existing_user = cursor.fetchone()

        if existing_user is not None:
            raise HTTPException(
                status_code=409,
                detail="Username already exists",
            )

        cursor.execute(
            """
            UPDATE users
            SET
                name = %s,
                username = %s,
                bio = %s,
                profile_image = %s
            WHERE id = %s
            """,
            (
                data.name,
                data.username,
                data.bio,
                data.profile_image,
                user_id,
            ),
        )

        connection.commit()

        return {
            "message": "Profile updated successfully",
            "user": {
                "id": user_id,
                "name": data.name,
                "username": data.username,
                "bio": data.bio,
                "profile_image": data.profile_image,
            },
        }

    finally:
        cursor.close()
        connection.close()


@app.delete("/users/{username}/follow")
def unfollow_user(username: str, request: Request):
    session_id = request.cookies.get("session_id")

    if session_id is None:
        raise HTTPException(
            status_code=401,
            detail="Not authenticated",
        )

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(
            """
            SELECT user_id
            FROM sessions
            WHERE session_id = %s
              AND expires_at > NOW()
            """,
            (session_id,),
        )

        session = cast(
            dict[str, object] | None,
            cursor.fetchone(),
        )

        if session is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid or expired session",
            )

        follower_id = cast(int, session["user_id"])

        cursor.execute(
            """
            SELECT id
            FROM users
            WHERE username = %s
            """,
            (username,),
        )

        target_user = cast(
            dict[str, object] | None,
            cursor.fetchone(),
        )

        if target_user is None:
            raise HTTPException(
                status_code=404,
                detail="User not found",
            )

        following_id = cast(int, target_user["id"])

        cursor.execute(
            """
            DELETE FROM followers
            WHERE follower_id = %s
              AND following_id = %s
            """,
            (follower_id, following_id),
        )

        if cursor.rowcount == 0:
            raise HTTPException(
                status_code=404,
                detail="Follow relationship not found",
            )

        connection.commit()

        return {
            "message": "Unfollow successful",
        }

    finally:
        cursor.close()
        connection.close()


@app.get("/posts/following")
def get_following_posts(
    request: Request,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=50),
):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        session_id = request.cookies.get("session_id")

        if not session_id:
            raise HTTPException(
                status_code=401,
                detail="Not authenticated",
            )

        cursor.execute(
            """
            SELECT user_id
            FROM sessions
            WHERE session_id = %s
              AND expires_at > NOW()
            """,
            (session_id,),
        )

        session = cast(
            dict[str, Any] | None,
            cursor.fetchone(),
        )

        if not session:
            raise HTTPException(
                status_code=401,
                detail="Invalid or expired session",
            )

        logged_in_user_id = int(session["user_id"])

        offset = (page - 1) * limit

        cursor.execute(
            """
            SELECT
                posts.id,
                posts.title,
                posts.content,
                posts.image_url,
                posts.created_at,
                users.id AS user_id,
                users.username,
                users.profile_image
            FROM posts
            JOIN users
                ON posts.user_id = users.id
            WHERE posts.user_id = %s
               OR EXISTS (
                    SELECT 1
                    FROM followers
                    WHERE followers.follower_id = %s
                      AND followers.following_id = posts.user_id
               )
            ORDER BY posts.created_at DESC
            LIMIT %s OFFSET %s
            """,
            (
                logged_in_user_id,
                logged_in_user_id,
                limit,
                offset,
            ),
        )

        posts = cursor.fetchall()

        return {
            "posts": posts,
        }

    finally:
        cursor.close()
        connection.close()


app.include_router(auth_router)
app.include_router(password_reset_router)
