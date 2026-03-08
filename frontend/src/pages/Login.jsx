import UseSignin from "../Hooks/UseSignin";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const {
    errors,
    showPass,
    setShowPass,
    handleChange,
    handleBlur,
    handleSubmit,
    form,
    touched,
    loading,
  } = UseSignin();

  return (
    <>
      <div className="flex flex-col justify-center md:flex-row min-h-screen bg-gray-100">
        <div className="flex items-center justify-center w-full md:w-1/2 px-4 sm:px-6 md:px-10 py-10">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-5 sm:p-6 md:p-8 rounded-xl shadow-md w-full max-w-md border"
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-5 text-gray-800">
              Welcome Back
            </h2>
            <div className="mb-4">
              <label className="block text-xs sm:text-sm font-medium mb-1">
                Email
              </label>
              <input
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full p-2 sm:p-3 border rounded-lg text-xs sm:text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {touched.email && errors.email && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">
                  {errors.email}
                </p>
              )}
            </div>
            <div className="mb-4 relative">
              <label className="block text-xs sm:text-sm font-medium mb-1">
                Password
              </label>
              <input
                type={showPass ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full p-2 sm:p-3 border rounded-lg text-xs sm:text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-8 sm:top-9 text-gray-500"
              >
                {showPass ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
              {touched.password && errors.password && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">
                  {errors.password}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 sm:py-3 rounded-lg text-sm sm:text-base md:text-lg font-semibold text-white transition
              ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-yellow-500 hover:bg-yellow-600"
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            <div className="flex flex-col items-center gap-2 sm:gap-3 mt-4 text-xs sm:text-sm">
              <div className="flex gap-2">
                <p>New customer?</p>
                <Link className="text-blue-600 hover:underline" to="/signup">
                  Create account
                </Link>
              </div>
            </div>
          </form>
        </div>
        <div className="hidden md:flex w-1/2 bg-blue-600 text-white items-center justify-center px-8 lg:px-12">
          <div>
            <h1 className="text-2xl lg:text-5xl font-bold mb-4 lg:mb-6">
              Shop Smarter
            </h1>
            <p className="text-sm sm:text-base lg:text-lg leading-relaxed">
              Discover thousands of products at the best prices. Fast delivery,
              secure payments, and exclusive deals waiting for you every day.
            </p>
            <div className="mt-6 text-xs sm:text-sm opacity-90">
              Trusted by thousands of customers
              <br />
              Secure checkout
              <br /> 24/7 customer support
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
