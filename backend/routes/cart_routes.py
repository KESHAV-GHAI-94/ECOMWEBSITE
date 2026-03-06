from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from config.db import SessionLocal
from models.cart_models import Cart
from models.product_models import Product
from Schemas.cart_schema import AddToCart, RemoveCart, UpdateQuantity
from middlewares.Auth_middleware import user_required

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# print(Cart.__table__.columns.keys())


@router.post("/cart/add-to-product")  # add to cart
def addtocart(
    data: AddToCart, user=Depends(user_required), db: Session = Depends(get_db)
):
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


@router.post("/cart/remove-cart")  # remove the whole product from cart
def removep(
    data: RemoveCart, user=Depends(user_required),
    db: Session = Depends(get_db)
):
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


@router.post("/updatequantity-product")  # update quantity
def updatequantity(
    data: UpdateQuantity, user=Depends(user_required),
    db: Session = Depends(get_db)
):
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


@router.get("/view-cart")  # view-cart
def viewcart(user=Depends(user_required), db: Session = Depends(get_db)):
    cart_items = db.query(Cart).filter(Cart.user_id == user["user_id"]).all()
    if not cart_items:
        raise HTTPException(status_code=404, detail="no item in cart.")
    result = []
    for item in cart_items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if not product:
            continue
        result.append(
            {
                "product_id": product.id,
                "product_name": product.p_name,
                "price": product.p_price,
                "quantity": item.quantity,
                "total price": product.p_price * item.quantity,
                "discount": product.p_discount,
                "final_price": (product.p_price * item.quantity)
                - (product.p_discount * item.quantity),
            }
        )
    return {"user_id": user["user_id"], "cart": result}
