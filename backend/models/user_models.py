from sqlalchemy import Column, Integer, String, DateTime, Boolean
from config.db import Base


class User(Base):
    __tablename__ = "ecom_users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True)
    password = Column(String)
    otp = Column(Integer, nullable=True)
    is_active = Column(Boolean, default=False)
    otp_expiry = Column(DateTime, nullable=True)
    role = Column(String, default="admin")
