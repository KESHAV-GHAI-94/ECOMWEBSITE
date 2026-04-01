from sqlalchemy import Column, Integer, ForeignKey
from config.db import Base


class OrderItem(Base):
    __tablename__ = "ecom_order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    quantity = Column(Integer)
    price = Column(Integer)
