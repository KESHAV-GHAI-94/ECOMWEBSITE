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
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const App =() => {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route element={<AdminLayout />}>
        <Route path="/dashboard" element={<Admin/>}/>
        <Route path="/products" element={<AdminProducts/>}/>
        <Route path="/product/:id" element={<ProductEdit/>}/>
        <Route path="/orders" element={<AdminOrders/>}/>
        <Route path="/admin/order/:id" element={<AdminOrderDetails />} />
        </Route>
        <Route path="/shop" element={<Shop/>}/>
      </Routes>
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  )
}
export default App 