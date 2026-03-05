from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from config.db import SessionLocal
from models.product_models import Product
from Schemas.product_schema import ProductDelete
from middlewares.Auth_middleware import admin_required
import base64

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/create-product")
async def create_product(
    p_name: str = Form(...),
    p_description: str = Form(...),
    p_price: int = Form(...),
    p_discount: int = Form(...),
    image: UploadFile = File(None),
    admin=Depends(admin_required),
    db: Session = Depends(get_db),
):
    image_bytes = None
    if image:
        image_bytes = await image.read()

    new_product = Product(
        p_name=p_name,
        p_description=p_description,
        p_price=p_price,
        p_discount=p_discount,
        p_image=image_bytes,
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    image_base64 = None
    if new_product.p_image:
        image_base64 = base64.b64encode(new_product.p_image).decode("utf-8")

    return {
        "message": "Product created successfully",
        "created_by_admin": admin["user_id"],
        "product": {
            "id": new_product.id,
            "p_name": new_product.p_name,
            "p_description": new_product.p_description,
            "p_price": new_product.p_price,
            "p_discount": new_product.p_discount,
            "p_image": image_base64,
        },
    }


@router.post("/remove-product")
def removeproduct(
    product: ProductDelete, admin=Depends(admin_required), 
    db: Session = Depends(get_db)
):
    db_product = db.query(Product).filter(Product.id == product.id).first()

    if not db_product:
        return {"message": "product not found !"}
    db.delete(db_product)
    db.commit()

    return {
        "message": "product deleted successlly",
        "deletedby_admin": admin["user_id"],
    }


@router.post("/update-product")
async def Productupdate(
    id: int = Form(...),
    p_name: str = Form(...),
    p_description: str = Form(...),
    p_price: int = Form(...),
    p_discount: int = Form(...),
    image: UploadFile = File(None),
    admin=Depends(admin_required),
    db: Session = Depends(get_db),
):
    db_product = db.query(Product).filter(Product.id == id).first()

    if not db_product:
        return {"message": "product not found"}

    db_product.p_name = p_name
    db_product.p_description = p_description
    db_product.p_price = p_price
    db_product.p_discount = p_discount

    if image:
        image_bytes = await image.read()
        db_product.p_image = image_bytes

    db.commit()
    db.refresh(db_product)

    image_base64 = None
    if db_product.p_image:
        image_base64 = base64.b64encode(db_product.p_image).decode("utf-8")

    return {
        "message": "product updated successfully",
        "updatedbyadmin": admin["user_id"],
        "product": {
            "id": db_product.id,
            "p_name": db_product.p_name,
            "p_description": db_product.p_description,
            "p_price": db_product.p_price,
            "p_discount": db_product.p_discount,
            "p_image": image_base64,
        },
    }


@router.get("/products")  # products to display
def viewproducts(db: Session = Depends(get_db)):
    products = db.query(Product).all()
    product_list = []
    for product in products:
        image_base64 = None
        if product.p_image:
            image_base64 = base64.b64encode(product.p_image).decode("utf-8")
        product_list.append(
            {
                "id": product.id,
                "p_name": product.p_name,
                "p_description": product.p_description,
                "p_price": product.p_price,
                "p_discount": product.p_discount,
                "p_image": image_base64,
            }
        )

    return {
        "message": "Products fetch successfully.",
        "products": product_list
    }


@router.get("/view-product/{id}")
def viewproduct(id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    image_base64 = None
    if product.p_image:
        image_base64 = base64.b64encode(product.p_image).decode("utf-8")
    return {
        "product": {
            "id": product.id,
            "p_name": product.p_name,
            "p_description": product.p_description,
            "p_price": product.p_price,
            "p_discount": product.p_discount,
            "p_image": image_base64
        }
    }