from fastapi import HTTPException
from sqlalchemy.orm import Session
from models.cart_models import Cart
from models.order_items_models import OrderItem
from models.order_models import Order
from models.product_models import Product
import base64


def checkout(user, db: Session):
    cart_items = db.query(Cart).filter(Cart.user_id == user["user_id"]).all()
    if not cart_items:
        raise HTTPException(status_code=404, detail="no item in cart.")
    total_price = 0
    products = {}
    for item in cart_items:
        product = db.query(Product).filter(
            Product.id == item.product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        products[item.product_id] = product
        final_price = round(product.p_price - (
            product.p_price * product.p_discount / 100), 2)
        total_price += final_price * item.quantity
    order = Order(user_id=user["user_id"], total_price=total_price)
    db.add(order)
    db.commit()
    db.refresh(order)
    for item in cart_items:
        product = products[item.product_id]
        final_price = round(product.p_price - (
            product.p_price * product.p_discount / 100), 2)
        order_item = OrderItem(
            order_id=order.id,
            product_id=product.id,
            quantity=item.quantity,
            price=final_price,
        )
        db.add(order_item)
    db.commit()
    db.query(Cart).filter(Cart.user_id == user["user_id"]).delete()
    db.commit()
    return {
        "message": "order placed successfully",
        "order_id": order.id,
        "order_price": total_price,
        "created_at": order.created_at
    }


def getorders(user, db: Session):
    orders = db.query(Order).filter(
        Order.user_id == user["user_id"]).all()
    order_list = []
    for order in orders:
        order_list.append({
            "order_id": order.id,
            "total_price": order.total_price,
            "status": order.status,
            "created_at": order.created_at
        })
    return {
        "total_orders": len(order_list),
        "orders": order_list
    }


def getdetailed_order(id: int, user, db: Session):
    order = db.query(Order).filter(
        Order.id == id,
        Order.user_id == user["user_id"]
    ).first()
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
        products.append({
            "product_id": product.id,
            "product_name": product.p_name,
            "original_price": product.p_price,
            "discount": product.p_discount,
            "price_after_discount": item.price,
            "image": product.p_image,
            "quantity": item.quantity,
            "total_price": item.price * item.quantity
        })
    return {
        "order_id": order.id,
        "user_id": order.user_id,
        "total_price": order.total_price,
        "status": order.status,
        "products": products,
        "created_at": order.created_at,
    }


def cancelorder(id: int, user, db: Session):
    order = (
        db.query(Order).filter(Order.id == id,
                               Order.user_id == user["user_id"]).first()
    )
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.status == "Cancelled":
        raise HTTPException(status_code=400, detail="Order already cancelled")
    order.status = "Cancelled"
    db.commit()
    return {
        "message": "order cancelled",
        "order_id": order.id,
        "status": order.status
    }
