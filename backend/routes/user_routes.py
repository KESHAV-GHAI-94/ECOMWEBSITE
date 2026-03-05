from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from config.db import SessionLocal
from models.user_models import User
from Schemas.user_schema import UserCreate, LoginUser, VerifyOtp
from passlib.context import CryptContext
from datetime import datetime, timedelta
import random
from utils.jwt_handler import create_access_token
from utils.send_email import send_otp_email

router = APIRouter()

pwd = CryptContext(schemes=["argon2"], deprecated="auto")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/signup")
async def signup(user: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")
    hashpassword = pwd.hash(user.password)
    generated_otp = random.randint(100000, 999999)
    otp_expiry_time = datetime.utcnow() + timedelta(minutes=5)
    new_user = User(
        name=user.name,
        email=user.email,
        password=hashpassword,
        otp=generated_otp,
        otp_expiry=otp_expiry_time,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    await send_otp_email(user.email, generated_otp)
    return {
        "message": "User created! OTP sent to email",
        "id": new_user.id,
        "email": new_user.email,
    }


@router.post("/verifyOtp")
async def verifyOtp(user: VerifyOtp, db: Session = Depends(get_db)):
    dbuser = db.query(User).filter(User.email == user.email).first()
    if not dbuser:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    if dbuser.otp != user.otp:
        raise HTTPException(status_code=400, detail="Invalid Otp")
    if dbuser.otp_expiry < datetime.utcnow():
        raise HTTPException(status_code=400, detail="OTP expired")
    dbuser.is_active = True
    dbuser.otp = None
    db.commit()
    return {
        "message": "User verified successfully",
        "id": dbuser.id,
        "email": dbuser.email,
    }


@router.post("/login")
def login(user: LoginUser, db: Session = Depends(get_db)):

    dbuser = db.query(User).filter(User.email == user.email).first()
    if not dbuser:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    if not dbuser.is_active:
        raise HTTPException(status_code=400, detail="Please verify OTP first")
    if not pwd.verify(user.password, dbuser.password):
        raise HTTPException(status_code=400, detail="Invalid password")

    token = create_access_token({"user_id": dbuser.id, "role": dbuser.role})
    return {
        "message": "login successful",
        "access_token": token,
        "user_id": dbuser.id,
        "email": dbuser.email,
        "role": dbuser.role,
    }
