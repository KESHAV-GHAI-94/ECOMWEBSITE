from fastapi import FastAPI
from config.db import engine, Base  # SessionLocal#engine-joining db connect

# routes
from routes.user_routes import router as user_router
from routes.products_routes import router as product_router
from routes.cart_routes import router as cart_router
app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(user_router)
app.include_router(product_router)
app.include_router(cart_router)


# print(cart.__table__.columns.keys())


@app.get("/")
def main():
    return {"message": "db connected sucessfully"}
