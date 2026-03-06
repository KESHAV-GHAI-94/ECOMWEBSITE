from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from utils.db_dependency import get_db
from Schemas.cart_schema import AddToCart, RemoveCart, UpdateQuantity
from middlewares.Auth_middleware import user_required
from controllers.cart_controller import (
    addtocart,
    remove_product,
    updatequantity,
    viewcart
)
router = APIRouter()
# print(Cart.__table__.columns.keys())


@router.post("/add-to-product")  # add to cart
def add_to_cart(
    data: AddToCart,
    user=Depends(user_required),
    db: Session = Depends(get_db)
):
    return addtocart(data, user, db)


@router.post("/remove-cart")
def remove_cart_route(
    data: RemoveCart,
    user=Depends(user_required),
    db: Session = Depends(get_db)
):
    return remove_product(data, user, db)


@router.post("/updatequantity-product")
def update_quantity_route(
    data: UpdateQuantity,
    user=Depends(user_required),
    db: Session = Depends(get_db)
):
    return updatequantity(data, user, db)


@router.get("/view-cart")
def view_cart_route(
    user=Depends(user_required),
    db: Session = Depends(get_db)
):
    return viewcart(user, db)
