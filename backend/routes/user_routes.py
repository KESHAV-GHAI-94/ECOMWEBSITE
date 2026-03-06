from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from Schemas.user_schema import UserCreate, LoginUser, VerifyOtp
from middlewares.Auth_middleware import get_current_user
from utils.db_dependency import get_db
from controllers.user_controller import (
    signup_controller,
    verify_otp_controller,
    login_controller,
    profile_controller,
    logout_controller
)

router = APIRouter()


@router.post("/signup")
async def signup(user: UserCreate, db: Session = Depends(get_db)):
    return await signup_controller(user, db)


@router.post("/verifyOtp")
async def verifyOtp(user: VerifyOtp, db: Session = Depends(get_db)):
    return await verify_otp_controller(user, db)


@router.post("/login")
def login(user: LoginUser, db: Session = Depends(get_db)):
    return login_controller(user, db)


@router.get("/profile")
def profile(user=Depends(get_current_user), db: Session = Depends(get_db)):
    return profile_controller(user, db)


@router.post("/logout")
def logout():
    return logout_controller()
