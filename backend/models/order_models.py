from sqlalchemy import Column, Integer, ForeignKey, DateTime, String
from sqlalchemy.sql import func
from config.db import Base


class Order(Base):
    __tablename__ = "ecom_orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("ecom_users.id"))
    total_price = Column(Integer)
    status = Column(String, default="pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
