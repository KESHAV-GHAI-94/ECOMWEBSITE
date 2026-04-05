from fastapi import HTTPException
from sqlalchemy.orm import Session
from models.user_models import User
from passlib.context import CryptContext
from datetime import datetime, timedelta
import random
import os
from dotenv import load_dotenv
from utils.jwt_handler import create_access_token
from utils.send_email import send_otp_email

load_dotenv()
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "keshavghai94@gmail.com")

pwd = CryptContext(schemes=["argon2"], deprecated="auto")


async def signup_controller(user, db: Session):
    existing = db.query(User).filter(User.email == user.email).first()
    generated_otp = random.randint(100000, 999999)
    otp_expiry_time = datetime.utcnow() + timedelta(minutes=5)
    if existing:
        if existing.is_active:
            raise HTTPException(status_code=400, detail="User already exists")
        existing.otp = generated_otp
        existing.otp_expiry = otp_expiry_time
        db.commit()
        await send_otp_email(user.email, generated_otp)
        return {
            "message": "OTP resent to email",
            "email": existing.email
        }
    hashpassword = pwd.hash(user.password)
    role = "admin" if user.email.lower() == ADMIN_EMAIL.lower() else "user"
    new_user = User(
        name=user.name,
        email=user.email,
        password=hashpassword,
        otp=generated_otp,
        otp_expiry=otp_expiry_time,
        is_active=False,
        role=role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    await send_otp_email(user.email, generated_otp)
    return {
        "message": "User created! OTP sent to email",
        "id": new_user.id,
        "email": new_user.email
    }


async def verify_otp_controller(user, db: Session):
    dbuser = db.query(User).filter(User.email == user.email).first()
    if not dbuser:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    if dbuser.otp != user.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")
    if dbuser.otp_expiry < datetime.utcnow():
        raise HTTPException(status_code=400, detail="OTP has expired. Please signup again to get a new OTP")
    dbuser.is_active = True
    dbuser.otp = None
    dbuser.otp_expiry = None
    db.commit()
    return {
        "message": "User verified successfully",
        "id": dbuser.id,
        "email": dbuser.email
    }


def login_controller(user, db: Session):
    dbuser = db.query(User).filter(User.email == user.email).first()
    if not dbuser:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    if not dbuser.is_active:
        raise HTTPException(status_code=400, detail="Please verify OTP first")
    if not pwd.verify(user.password, dbuser.password):
        raise HTTPException(status_code=400, detail="Invalid password")
    token = create_access_token(
        {"user_id": dbuser.id, "role": dbuser.role}
    )
    return {
        "message": "login successful",
        "access_token": token,
        "user_id": dbuser.id,
        "email": dbuser.email,
        "role": dbuser.role
    }


def profile_controller(user, db: Session):
    profile_user = db.query(User).filter(User.id == user["user_id"]).first()
    if not profile_user:
        raise HTTPException(status_code=404, detail="No user found")
    return {
        "id": profile_user.id,
        "name": profile_user.name,
        "email": profile_user.email,
        "role": profile_user.role
    }


def logout_controller():
    return {
        "message": "Logged out successfully"
    }
