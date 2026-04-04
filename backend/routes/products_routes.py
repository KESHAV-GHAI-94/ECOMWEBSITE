from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from utils.db_dependency import get_db
from controllers.product_controller import (
    viewproducts,
    viewproduct,
    searchproduct,
    filterproduct
)
router = APIRouter()


@router.get("/products")
def get_products(db: Session = Depends(get_db)):
    return viewproducts(db)


@router.get("/view-product/{id}")
def get_product(id: int, db: Session = Depends(get_db)):
    return viewproduct(id, db)


@router.get("/product/search")
def search_products(search: str, db: Session = Depends(get_db)):
    return searchproduct(search, db)


@router.get("/filter/products/{category}")
def filter_products(category: str, db: Session = Depends(get_db)):
    return filterproduct(category, db)
