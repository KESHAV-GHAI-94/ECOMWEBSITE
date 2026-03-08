from fastapi import FastAPI
from config.db import engine, Base
# routes
from routes.user_routes import router as user_router
from routes.admin_routes import router as admin_router
from routes.cart_routes import router as cart_router
from routes.order_routes import router as order_router
from routes.products_routes import router as product_router
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(user_router, tags=["Auth"])
app.include_router(admin_router, prefix="/admin", tags=["admin"])
app.include_router(product_router, tags=["products"])
app.include_router(cart_router, prefix="/cart", tags=["cart"])
app.include_router(order_router, prefix="/orders",
                   tags=["orders and checkout"])
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# print(cart.__table__.columns.keys())


@app.get("/")
def main():
    return {"message": "db connected sucessfully"}
