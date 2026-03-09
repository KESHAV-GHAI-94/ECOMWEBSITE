import React from "react"
import { Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Admin from "./pages/Admin"
import Shop from "./pages/shop"
import AdminLayout from "./components/Admin/layouts/AdminLayout"
import AdminProducts from "./pages/AdminProducts"
import ProductEdit from "./pages/ProductEdit"
import AdminOrders from "./pages/AdminOrders"
import AdminOrderDetails from "./pages/AdminOrderDetails"
import ShopmainLayout from "./components/Shop/ShopmainLayout"
import ShopProductDetailpage from "./pages/ShopProductDetailpage"
import Orderdetailedpage from "./pages/Orderdetailedpage"
import Orders from "./pages/Orders"
import Cart from "./pages/Cart"
import Home from "./pages/Home"
import ProtectedRoute from "./routes/ProtectedRoute"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const App =() => {
  return (
    <div>
      <Routes>
        {/* admin role */}
        <Route element={<AdminLayout />}>
        <Route path="/dashboard" element={<Admin/>}/>
        <Route path="/products" element={<AdminProducts/>}/>
        <Route path="/product/:id" element={<ProductEdit/>}/>
        <Route path="/orders" element={<AdminOrders/>}/>
        <Route path="/admin/order/:id" element={<AdminOrderDetails />} />
        </Route>
        <Route element={<ShopmainLayout/>}>
        <Route path="/shop" element={<Shop/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/productdetail/:id" element={<ShopProductDetailpage/>}/>
        <Route path="/" element={<Home/>}/>

        <Route path="/user/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>}/>
        <Route path="/user/orders" element={<ProtectedRoute><Orders/></ProtectedRoute>}/>
        <Route path="/user/orders/:id" element={<ProtectedRoute><Orderdetailedpage/></ProtectedRoute> } />
        </Route>
      </Routes>
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  )
}
export default App 