from fastapi import HTTPException
from sqlalchemy.orm import Session
from models.cart_models import Cart
from models.order_items_models import OrderItem
from models.order_models import Order
from models.product_models import Product


def checkout(user, db: Session):
    cart_items = db.query(Cart).filter(Cart.user_id == user["user_id"]).all()
    if not cart_items:
        raise HTTPException(status_code=404, detail="no item in cart.")
    total_price = 0
    for item in cart_items:
        product = db.query(Product).filter(
            Product.id == item.product_id).first()
        total_price += (product.p_price * item.quantity) - (
            product.p_discount * item.quantity
        )
    order = Order(user_id=user["user_id"], total_price=total_price)
    db.add(order)
    db.commit()
    db.refresh(order)
    for item in cart_items:
        product = db.query(Product).filter(
            Product.id == item.product_id).first()
        order_item = OrderItem(
            order_id=order.id,
            product_id=product.id,
            quantity=item.quantity,
            price=(product.p_price * item.quantity)
            - (product.p_discount * item.quantity),
        )
        db.add(order_item)
    db.commit()
    db.query(Cart).filter(Cart.user_id == user["user_id"]).delete()
    db.commit()
    return {
        "message": "order placed successfully",
        "order_id": order.id,
        "Order price": total_price,
    }


def getorders(user, db: Session):
    order = db.query(Order).filter(Order.user_id == user["user_id"]).all()
    return order


def getdetailed_order(
    id: int, user, db: Session
):
    order = (
        db.query(Order).filter(Order.id == id,
                               Order.user_id == user["user_id"]).first()
    )
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order_items = (
        db.query(OrderItem, Product)
        .join(Product, Product.id == OrderItem.product_id)
        .filter(OrderItem.order_id == id)
        .all()
    )
    products = []
    for item, product in order_items:
        products.append(
            {
                "product_id": product.id,
                "product_name": product.p_name,
                "price": item.price,
                "quantity": item.quantity,
                "total_price": item.price * item.quantity,
            }
        )
    return {
        "order_id": order.id,
        "user_id": order.user_id,
        "total_price": order.total_price,
        "status": order.status,
        "products": products,
    }


def cancelorder(id: int, user, db: Session):
    order = (
        db.query(Order).filter(Order.id == id,
                               Order.user_id == user["user_id"]).first()
    )
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order.status = "Cancelled"
    db.commit()
    return {"message": "order cancelled"}
