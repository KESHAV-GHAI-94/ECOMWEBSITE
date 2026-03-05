from pydantic import BaseModel


class AddToCart(BaseModel):
    product_id: int
    quantity: int


class UpdateCart(BaseModel):
    product_id: int
    quantity: int


class UpdateQuantity(BaseModel):
    product_id: int
    quantity: int


class RemoveCart(BaseModel):
    product_id: int
