from fastapi import HTTPException
from sqlalchemy.orm import Session
from models.cart_models import Cart
from models.product_models import Product


def addtocart(data, user, db: Session):
    product = db.query(Product).filter(Product.id == data.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    existing = (
        db.query(Cart)
        .filter(Cart.user_id == user["user_id"],
                Cart.product_id == data.product_id)
        .first()
    )
    if existing:
        existing.quantity += data.quantity
    else:
        cart_item = Cart(
            user_id=user["user_id"],
            product_id=data.product_id, quantity=data.quantity
        )
        db.add(cart_item)
    db.commit()
    return {"message": "product added to cart successfully"}


def remove_product(data, user, db: Session):
    cart_item = (
        db.query(Cart)
        .filter(Cart.user_id == user["user_id"],
                Cart.product_id == data.product_id)
        .first()
    )
    if not cart_item:
        raise HTTPException(status_code=404,
                            detail="Product not found in the cart")
    db.delete(cart_item)
    db.commit()
    return {"message": "Product removed successfully !"}


def updatequantity(data, user, db: Session):
    cart_item = (
        db.query(Cart)
        .filter(Cart.user_id == user["user_id"],
                Cart.product_id == data.product_id)
        .first()
    )
    if not cart_item:
        raise HTTPException(status_code=404,
                            detail="Product not found in the cart")
    cart_item.quantity = data.quantity
    db.commit()
    db.refresh(cart_item)
    return {
        "message": "Cart quantity updated",
        "product_id": cart_item.product_id,
        "quantity": cart_item.quantity,
    }


def viewcart(user, db: Session):
    cart_items = db.query(Cart).filter(Cart.user_id == user["user_id"]).all()
    if not cart_items:
        raise HTTPException(status_code=404, detail="no item in cart.")
    result = []
    for item in cart_items:
        product = db.query(Product).filter(
            Product.id == item.product_id).first()
        if not product:
            continue
        result.append(
            {
                "product_id": product.id,
                "product_name": product.p_name,
                "price": product.p_price,
                "quantity": item.quantity,
                "total_price": product.p_price * item.quantity,
                "discount": product.p_discount,
                "final_price": (product.p_price * item.quantity)
                - (product.p_discount * item.quantity),
            }
        )
    return {"user_id": user["user_id"], "cart": result}
