from fastapi import APIRouter
from pydantic import BaseModel, EmailStr

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


@router.post("/forgot-password")
def forgot_password(data: ForgotPasswordRequest):
    return {
        "message": "Password reset request received",
        "email": data.email
    }
