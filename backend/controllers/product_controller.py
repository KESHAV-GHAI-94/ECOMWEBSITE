from fastapi import HTTPException, Response
from sqlalchemy.orm import Session
from models.product_models import Product


def viewproducts(db: Session):
    products = db.query(Product).all()
    product_list = []
    for product in products:
        final_price = product.p_price - (
            product.p_price * product.p_discount / 100)
        img_val = product.p_image
        if isinstance(img_val, bytes):
            try:
                img_val = img_val.decode('utf-8')
            except UnicodeDecodeError:
                img_val = None

        if not isinstance(img_val, str) or not img_val.startswith("http"):
            img_val = None
        
        product_list.append(
            {
                "id": product.id,
                "p_name": product.p_name,
                "p_description": product.p_description,
                "p_price": product.p_price,
                "p_discount": product.p_discount,
                "p_category": product.p_category,
                "p_image": img_val,
                "price_after_discount": round(final_price, 2)
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
    
    final_price = product.p_price - (
        product.p_price * product.p_discount / 100)

    img_val = product.p_image
    if not isinstance(img_val, str) or not img_val.startswith("http"):
        img_val = None

    return {
        "product": {
            "id": product.id,
            "p_name": product.p_name,
            "p_description": product.p_description,
            "p_price": product.p_price,
            "p_discount": product.p_discount,
            "p_category": product.p_category,
            "price_after_discount": round(final_price, 2),
            "p_image": img_val
        }
    }


def searchproduct(search: str, db: Session):

    products = db.query(Product).filter(
        Product.p_name.ilike(f"%{search}%")
    ).all()
    result = []
    for product in products:
        final_price = product.p_price - (
            product.p_price * product.p_discount / 100)
        img_val = product.p_image
        if isinstance(img_val, bytes):
            try:
                img_val = img_val.decode('utf-8')
            except UnicodeDecodeError:
                img_val = None

        if not isinstance(img_val, str) or not img_val.startswith("http"):
            img_val = None
            
        result.append({
            "id": product.id,
            "p_name": product.p_name,
            "p_description": product.p_description,
            "p_price": product.p_price,
            "p_discount": product.p_discount,
            "p_category": product.p_category,
            "price_after_discount": round(final_price, 2),
            "p_image": img_val
        })
    return {
        "search": search,
        "results": result
    }


def filterproduct(category: str, db: Session):
    products = db.query(Product).filter(Product.p_category == category).all()
    result = []
    for product in products:
        final_price = product.p_price - (
            product.p_price * product.p_discount / 100)
        img_val = product.p_image
        if isinstance(img_val, bytes):
            try:
                img_val = img_val.decode('utf-8')
            except UnicodeDecodeError:
                img_val = None

        if not isinstance(img_val, str) or not img_val.startswith("http"):
            img_val = None
            
        result.append({
            "id": product.id,
            "p_name": product.p_name,
            "p_description": product.p_description,
            "p_price": product.p_price,
            "p_discount": product.p_discount,
            "p_category": product.p_category,
            "price_after_discount": round(final_price, 2),
            "p_image": img_val
        })
    return {
        "category": category,
        "products": result
    }
