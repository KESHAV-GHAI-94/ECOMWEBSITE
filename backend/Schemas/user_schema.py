from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str


class VerifyOtp(BaseModel):
    email: EmailStr
    otp: int


class LoginUser(BaseModel):
    email: EmailStr
    password: str


class UserResponse(UserCreate):
    id: int
    name: str
    email: EmailStr

    class Config:
        form_attributes = True
