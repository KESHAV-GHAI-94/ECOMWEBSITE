from fastapi import HTTPException
from sqlalchemy.orm import Session
from models.product_models import Product
import base64


def viewproducts(db: Session):
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
                "p_category": product.p_category,
                "p_image": image_base64,
            }
        )
    return {
        "message": "Products fetch successfully.",
        "products": product_list
    }


def viewproduct(id: int, db: Session):
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
            "p_category": product.p_category,
            "p_image": image_base64
        }
    }


def searchproduct(search: str, db: Session):
    products = db.query(Product).filter(
        Product.p_name.ilike(f"%{search}%")).all()
    if not products:
        raise HTTPException(status_code=404, detail="No products found")
    result = []
    for product in products:
        result.append({
            "id": product.id,
            "name": product.p_name,
            "description": product.p_description,
            "price": product.p_price,
            "discount": product.p_discount
        })
    return {
        "searched": search,
        "results": result
    }


def filterproduct(category: str, db: Session):
    products = db.query(Product).filter(Product.p_category == category).all()
    result = []
    for product in products:
        image_base64 = None
        if product.p_image:
            image_base64 = base64.b64encode(product.p_image).decode("utf-8")
        result.append({
            "id": product.id,
            "p_name": product.p_name,
            "p_description": product.p_description,
            "p_price": product.p_price,
            "p_discount": product.p_discount,
            "p_category": product.p_category,
            "p_image": image_base64
        })
    return {
        "category": category,
        "products": result
    }
