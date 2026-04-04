import React, { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, ShoppingCart, Menu, X, User } from "lucide-react";
import { AuthContext } from "../../Context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const isActive = (path) => location.pathname === path;
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <nav className="bg-white shadow-md px-4 md:px-10 py-3 flex items-center justify-between sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-2">
        <span className="font-bold text-lg text-blue-600">Shop Smarter</span>
      </Link>
      <div className="hidden md:flex items-center gap-6 font-medium">
        <Link
          to="/"
          className={`${isActive("/") ? "text-blue-600 font-semibold" : ""} hover:text-blue-600`}
        >
          Home
        </Link>
        <Link
          to="/shop"
          className={`${isActive("/shop") ? "text-blue-600 font-semibold" : ""} hover:text-blue-600`}
        >
          Products
        </Link>
        {user && (
          <>
            <Link
              to="/user/cart"
              className={`${isActive("/user/cart") ? "text-blue-600" : ""}`}
            >
              <ShoppingCart size={22} />
            </Link>
            <Link
              to="/user/orders"
              className={`${isActive("/user/orders") ? "text-blue-600 font-semibold" : ""} hover:text-blue-600`}
            >
              Orders
            </Link>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-3 py-1 rounded-lg"
            >
              Logout
            </button>
          </>
        )}
        {!user && !isAuthPage && (
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Login
          </button>
        )}
      </div>
      <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
        {mobileOpen ? <X size={26} /> : <Menu size={26} />}
      </button>
      {mobileOpen && (
        <div className="absolute top-10 right-5 border border-gray-200 rounded-lg w-1/2 bg-white shadow-lg md:hidden">
          <div className="flex flex-col p-4 gap-3 ">
            <Link to="/" className="border-b border-gray-300"  onClick={() => setMobileOpen(false)}>
              Home
            </Link>
            <Link to="/shop" className="border-b border-gray-300"  onClick={() => setMobileOpen(false)}>
              Shop
            </Link>
            {user && (
              <>
                <Link to="/user/cart" className="border-b border-gray-300"  onClick={() => setMobileOpen(false)}>
                  Cart
                </Link>
                <Link to="/user/orders" className="border-b border-gray-300"  onClick={() => setMobileOpen(false)}>
                  Orders
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className="text-red-500 text-left"
                >
                  Logout
                </button>
              </>
            )}
            {!user && (
              <button
                onClick={() => {
                  navigate("/login");
                  setMobileOpen(false);
                }}
                className="text-blue-600 text-left"
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
