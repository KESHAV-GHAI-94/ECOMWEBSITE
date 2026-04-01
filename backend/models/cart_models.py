from sqlalchemy import Column, Integer, ForeignKey
from config.db import Base


class Cart(Base):
    __tablename__ = "ecom_cart"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("ecom_users.id"))
    product_id = Column(Integer, ForeignKey("ecom_products.id"))
    quantity = Column(Integer, default=1)