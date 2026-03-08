from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
from middlewares.Auth_middleware import admin_required
from utils.db_dependency import get_db
from controllers.admin_controller import (
    viewproducts,
    create_product,
    removeproduct,
    update_product,
    getorderdetails,
    updateorder,
    get_order_details,
    admin_dashboard
)
router = APIRouter()


@router.get("/products")
def view_products(admin=Depends(admin_required),
                  db: Session = Depends(get_db)):
    return viewproducts(admin, db)


@router.post("/create-product")
async def create_product_route(
    p_name: str = Form(...),
    p_description: str = Form(...),
    p_price: int = Form(...),
    p_discount: int = Form(...),
    p_category: str = Form(...),
    image: UploadFile = File(None),
    admin=Depends(admin_required),
    db: Session = Depends(get_db),
):
    return await create_product(
        p_name,
        p_description,
        p_price,
        p_discount,
        p_category,
        image,
        admin,
        db,
    )


@router.post("/remove-product")
def remove_product(product_id: int, admin=Depends(admin_required),
                   db: Session = Depends(get_db)):
    return removeproduct(product_id, admin, db)


@router.post("/update-product")
async def update_product_route(
    id: int = Form(...),
    p_name: str = Form(...),
    p_description: str = Form(...),
    p_price: int = Form(...),
    p_discount: int = Form(...),
    p_category: str = Form(...),
    image: UploadFile = File(None),
    admin=Depends(admin_required),
    db: Session = Depends(get_db),
):
    return await update_product(
        id,
        p_name,
        p_description,
        p_price,
        p_discount,
        p_category,
        image,
        admin,
        db,
    )


@router.get("/orders")
def get_orders(admin=Depends(admin_required), db: Session = Depends(get_db)):
    return getorderdetails(admin, db)


@router.get("/order/{order_id}")
def order_details(order_id: int,
                  admin=Depends(admin_required),
                  db: Session = Depends(get_db)):
    return get_order_details(order_id, admin, db)


@router.post("/update-order/status")
def update_order_status(
    order_id: int,
    status: str,
    admin=Depends(admin_required),
    db: Session = Depends(get_db),
):
    return updateorder(order_id, status, admin, db)


@router.get("/dashboard")
def dashboard(admin=Depends(admin_required), db: Session = Depends(get_db)):
    return admin_dashboard(admin, db)
