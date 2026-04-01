from sqlalchemy import Column, Integer, Float, String, LargeBinary
from config.db import Base


class Product(Base):
    __tablename__ = "ecom_products"
    id = Column(Integer, index=True, primary_key=True)
    p_name = Column(String)
    p_description = Column(String)
    p_price = Column(Integer)
    p_discount = Column(Float)
    p_image = Column(LargeBinary)
    p_category = Column(String)
