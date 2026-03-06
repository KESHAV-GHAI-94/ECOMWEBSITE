from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from utils.db_dependency import get_db
from middlewares.Auth_middleware import user_required
from controllers.order_controller import (
    checkout,
    getorders,
    getdetailed_order,
    cancelorder,
)
router = APIRouter()


@router.post("/checkout")
def checkout_route(user=Depends(user_required), db: Session = Depends(get_db)):
    return checkout(user, db)


@router.get("/order")
def get_orders(user=Depends(user_required), db: Session = Depends(get_db)):
    return getorders(user, db)


@router.get("/order/{id}")
def get_detailed_order_route(
    id: int, user=Depends(user_required), db: Session = Depends(get_db)
):
    return getdetailed_order(id, user, db)


@router.post("/order-cancel/{id}")
def cancel_order(
    id: int, user=Depends(user_required), db: Session = Depends(get_db)
):
    return cancelorder(id, user, db)


# print(OrderItem.__table__.columns.keys())
# print(Order.__table__.columns.keys())
