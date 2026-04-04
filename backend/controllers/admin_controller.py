from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from models.product_models import Product
from models.order_models import Order
from models.order_items_models import OrderItem
from models.user_models import User
import cloudinary
import cloudinary.uploader

cloudinary.config(
    cloud_name="dkgtjamhz",
    api_key="167617284638242",
    api_secret="FUPPw7eeIpKSA-LpJtuZHVUZ1kQ"
)

def viewproducts(admin, db: Session):
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
        "total_products": len(product_list),
        "products": product_list
    }


async def create_product(
    p_name,
    p_description,
    p_price,
    p_discount,
    p_category,
    image,
    admin,
    db: Session,
):
    existing_product = db.query(Product).filter(Product.p_name == p_name).first()
    if existing_product:
        raise HTTPException(status_code=400, detail="Product with this name already exists")

    image_url = None
    print(f"DEBUG CREATE PRODUCT: image={image}")
    if image:
        print(f"DEBUG CREATE PRODUCT: filename={getattr(image, 'filename', 'NO_FILENAME')}")
    if image and hasattr(image, "filename") and image.filename:
        print("DEBUG CREATE PRODUCT: Attempting to upload image...")
        try:
            upload_result = cloudinary.uploader.upload(image.file)
            print(f"DEBUG CREATE PRODUCT: Upload result: {upload_result}")
            image_url = upload_result.get("secure_url")
        except Exception as e:
            print(f"DEBUG CREATE PRODUCT: Upload Failed! {e}")
            raise e

    new_product = Product(
        p_name=p_name,
        p_description=p_description,
        p_price=p_price,
        p_discount=p_discount,
        p_category=p_category,
        p_image=image_url,
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    img_val = new_product.p_image
    if not isinstance(img_val, str) or not img_val.startswith("http"):
        img_val = None

    return {
        "message": "Product created successfully",
        "created_by_admin": admin["user_id"],
        "product": {
            "id": new_product.id,
            "p_name": new_product.p_name,
            "p_description": new_product.p_description,
            "p_price": new_product.p_price,
            "p_discount": new_product.p_discount,
            "p_category": new_product.p_category,
            "p_image": img_val,
        },
    }


def removeproduct(product_id, admin, db: Session):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="product not found")
    db.delete(db_product)
    db.commit()
    return {
        "message": "product deleted successfully",
        "deleted_by_admin": admin["user_id"],
    }


async def update_product(
    id,
    p_name,
    p_description,
    p_price,
    p_discount,
    p_category,
    image,
    admin,
    db: Session,
):

    db_product = db.query(Product).filter(Product.id == id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="product not found")
    db_product.p_name = p_name
    db_product.p_description = p_description
    db_product.p_price = p_price
    db_product.p_discount = p_discount
    db_product.p_category = p_category
    if image and hasattr(image, "filename") and image.filename:
        upload_result = cloudinary.uploader.upload(image.file)
        db_product.p_image = upload_result.get("secure_url")
    db.commit()
    db.refresh(db_product)
    
    img_val = db_product.p_image
    if not isinstance(img_val, str) or not img_val.startswith("http"):
        img_val = None
        
    return {
        "message": "product updated successfully",
        "updated_by_admin": admin["user_id"],
        "product": {
            "id": db_product.id,
            "p_name": db_product.p_name,
            "p_description": db_product.p_description,
            "p_price": db_product.p_price,
            "p_discount": db_product.p_discount,
            "p_category": db_product.p_category,
            "p_image": img_val,
        },
    }


def getorderdetails(admin, db: Session):
    orders = (
        db.query(Order, User)
        .join(User, User.id == Order.user_id)
        .all()
    )
    result = []
    for order, user in orders:
        order_items = (
            db.query(OrderItem, Product)
            .join(Product, Product.id == OrderItem.product_id)
            .filter(OrderItem.order_id == order.id)
            .all()
        )
        products = []
        for item, product in order_items:
            products.append({
                "product_id": product.id,
                "product_name": product.p_name,
                "price": item.price,
                "quantity": item.quantity
            })
        result.append({
            "order_id": order.id,
            "user_id": order.user_id,
            "user_name": user.name,
            "total_price": order.total_price,
            "status": order.status,
            "products": products
        })
    return {
        "admin_id": admin["user_id"],
        "orders": result
    }


def get_order_details(order_id: int, admin, db: Session):

    order_data = (
        db.query(Order, User)
        .join(User, User.id == Order.user_id)
        .filter(Order.id == order_id)
        .first()
    )
    if not order_data:
        raise HTTPException(status_code=404, detail="Order not found")
    order, user = order_data
    order_items = (
        db.query(OrderItem, Product)
        .join(Product, Product.id == OrderItem.product_id)
        .filter(OrderItem.order_id == order.id)
        .all()
    )
    products = []
    for item, product in order_items:
        img_val = product.p_image
        if isinstance(img_val, bytes):
            try:
                img_val = img_val.decode('utf-8')
            except UnicodeDecodeError:
                img_val = None

        if not isinstance(img_val, str) or not img_val.startswith("http"):
            img_val = None
        products.append({
            "product_id": product.id,
            "product_name": product.p_name,
            "product_image": img_val,
            "p_discount": product.p_discount,
            "p_category": product.p_category,
            "price": item.price,
            "quantity": item.quantity
        })
    return {
        "admin_id": admin["user_id"],
        "order": {
            "order_id": order.id,
            "user_id": order.user_id,
            "user_name": user.name,
            "user_email": user.email,
            "total_price": order.total_price,
            "status": order.status,
            "products": products
        }
    }


def updateorder(order_id, status, admin, db: Session):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order.status = status
    db.commit()
    db.refresh(order)
    return {
        "message": "Order status updated successfully",
        "updated_by_admin": admin["user_id"],
        "order_id": order.id,
        "new_status": order.status
    }


def admin_dashboard(admin, db: Session):
    total_users = db.query(User).count()
    total_products = db.query(Product).count()
    total_orders = db.query(Order).count()
    total_revenue = db.query(Order.total_price).all()
    revenue_sum = sum(order[0] for order in total_revenue)
    return {
        "admin_id": admin["user_id"],
        "dashboard": {
            "total_users": total_users,
            "total_products": total_products,
            "total_orders": total_orders,
            "total_revenue": revenue_sum
        }
    }


def get_top_products(admin, db: Session):
    top_products = (
        db.query(
            Product.id,
            Product.p_name,
            func.sum(OrderItem.quantity).label("total_sold")
        )
        .join(OrderItem, OrderItem.product_id == Product.id)
        .group_by(Product.id, Product.p_name)
        .order_by(func.sum(OrderItem.quantity).desc())
        .limit(3)
        .all()
    )
    result = []
    for product in top_products:
        result.append({
            "id": product.id,
            "p_name": product.p_name,
            "total_sold": product.total_sold
        })
    return {
        "admin_id": admin["user_id"],
        "top_products": result
    }