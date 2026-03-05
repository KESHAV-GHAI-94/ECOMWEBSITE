from pydantic import BaseModel


class ProductUpdate(BaseModel):
    id: int
    p_name: str
    p_description: str
    p_price: int
    p_discount: int
    p_image: bytes


class ProductResponse(BaseModel):
    id: int
    p_name: str
    p_description: str
    p_price: int
    p_discount: int


class ProductDelete(BaseModel):
    id: int

    class Config:
        from_attributes = True
