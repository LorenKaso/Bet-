import re
import secrets

from datetime import datetime, timedelta, timezone
from typing import cast

import bcrypt

from fastapi import APIRouter, Cookie, HTTPException, Response
from pydantic import BaseModel, EmailStr, Field, field_validator

from database import get_db_connection


router = APIRouter(
    tags=["Authentication"]
)


class RegisterRequest(BaseModel):
    name: str = Field(min_length=1, max_length=50)
    username: str = Field(min_length=3, max_length=50)
    email: EmailStr = Field(max_length=254)
    password: str = Field(min_length=8, max_length=64)

    @field_validator("name", mode="before")
    @classmethod
    def validate_name(cls, value: str) -> str:
        value = value.strip()

        if not value:
            raise ValueError("Name is required")

        return value

    @field_validator("username", mode="before")
    @classmethod
    def validate_username(cls, value: str) -> str:
        value = value.strip()

        if not re.search(r"[A-Za-z]", value):
            raise ValueError(
                "Username must contain at least one English letter"
            )

        if not re.fullmatch(r"[A-Za-z0-9!@#$%&*_.?-]+", value):
            raise ValueError(
                "Username contains invalid characters"
            )

        return value

    @field_validator("email", mode="before")
    @classmethod
    def normalize_email(cls, value: str) -> str:
        return value.strip()

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        if re.search(r"\s", value):
            raise ValueError("Password cannot contain spaces")

        if not re.search(r"[A-Za-z]", value):
            raise ValueError(
                "Password must contain at least one English letter"
            )

        if not re.search(r"\d", value):
            raise ValueError(
                "Password must contain at least one number"
            )

        return value


@router.post("/register")
def register(user: RegisterRequest):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT id, email, username
        FROM users
        WHERE email = %s OR username = %s
        """,
        (user.email, user.username),
    )

    existing_user = cast(dict[str, object] | None, cursor.fetchone())

    cursor.close()
    connection.close()

    if existing_user:
        if existing_user["email"] == user.email:
            raise HTTPException(
                status_code=409,
                detail="Email already registered",
            )

        raise HTTPException(
            status_code=409,
            detail="Username already taken",
        )

    password_hash = bcrypt.hashpw(
        user.password.encode("utf-8"),
        bcrypt.gensalt(),
    ).decode("utf-8")

    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        cursor.execute(
            """
            INSERT INTO users (name, username, email, password_hash)
            VALUES (%s, %s, %s, %s)
            """,
            (
                user.name,
                user.username,
                user.email,
                password_hash,
            ),
        )

        user_id = cursor.lastrowid

        verification_token = secrets.token_urlsafe(32)

        token_hash = bcrypt.hashpw(
            verification_token.encode("utf-8"),
            bcrypt.gensalt(),
        ).decode("utf-8")

        expires_at = datetime.now(timezone.utc) + timedelta(hours=24)

        cursor.execute(
            """
            INSERT INTO email_verification_tokens
            (user_id, token_hash, expires_at)
            VALUES (%s, %s, %s)
            """,
            (
                user_id,
                token_hash,
                expires_at,
            ),
        )

        connection.commit()

    except Exception:
        connection.rollback()
        raise

    finally:
        cursor.close()
        connection.close()

    return {
        "message": "User registered successfully",
        "name": user.name,
        "username": user.username,
        "email": user.email,
    }


class LoginRequest(BaseModel):
    email: EmailStr = Field(max_length=254)
    password: str = Field(min_length=1, max_length=64)

    @field_validator("email", mode="before")
    @classmethod
    def normalize_email(cls, value: str) -> str:
        return value.strip()


@router.post("/login")
def login(user: LoginRequest, response: Response):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT id, email, username, password_hash
        FROM users
        WHERE email = %s
        """,
        (user.email,),
    )

    existing_user = cast(
        dict[str, str | int] | None,
        cursor.fetchone(),
    )

    cursor.close()
    connection.close()

    if existing_user is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
        )

    password_hash = cast(str, existing_user["password_hash"])
    password_matches = bcrypt.checkpw(
        user.password.encode("utf-8"),
        password_hash.encode("utf-8"),
    )

    if not password_matches:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
        )

    session_id = secrets.token_urlsafe(32)
    expires_at = datetime.now(timezone.utc) + timedelta(days=7)
    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        INSERT INTO sessions (session_id, user_id, expires_at)
        VALUES (%s, %s, %s)
        """,
        (
            session_id,
            existing_user["id"],
            expires_at,
        ),
    )

    connection.commit()

    cursor.close()
    connection.close()

    response.set_cookie(
        key="session_id",
        value=session_id,
        httponly=True,
        samesite="lax",
        max_age=60 * 60 * 24 * 7,
    )
    return {
        "message": "Login successful",
        "email": existing_user["email"],
        "username": existing_user["username"],
    }


@router.post("/logout")
def logout(
    response: Response,
    session_id: str | None = Cookie(default=None),
):
    if session_id:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute(
            """
            DELETE FROM sessions
            WHERE session_id = %s
            """,
            (session_id,),
        )

        connection.commit()
        cursor.close()
        connection.close()

    response.delete_cookie(
        key="session_id",
        samesite="lax",
    )

    return {"message": "Logout successful"}