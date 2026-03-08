import React from "react"
import { Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Admin from "./pages/Admin"
import Shop from "./pages/shop"
import AdminLayout from "./components/Admin/layouts/AdminLayout"
import AdminProducts from "./pages/AdminProducts"
import ProductEdit from "./pages/ProductEdit"
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
        <Route path="/admin/products" element={<AdminProducts/>}/>
        <Route path="/admin-product/:id" element={<ProductEdit/>}/>
        </Route>
        <Route path="/shop" element={<Shop/>}/>
      </Routes>
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  )
}
export default App 