import useSignup from "../Hooks/UseSignup";
import { Link } from "react-router-dom";
import OtpModal from "../components/modals/Otpmodal";
import { Eye, EyeOff } from "lucide-react";

const Signup = () => {
  const {
    showOtpModal,
    setOtp,
    loadingOtp,
    errors,
    showPass,
    setShowPass,
    showCPass,
    setShowCPass,
    verifySignupOtp,
    handleChange,
    handleBlur,
    handleSubmit,
    form,
    setShowOtpModal,
    loading,
    otp,
  } = useSignup();

  return (
    <>
      <div className="flex flex-col justify-center md:flex-row min-h-[calc(100vh-64px)] bg-gray-100">
        <div className="flex items-center justify-center w-full md:w-1/2 px-4 sm:px-6 md:px-10 py-3">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-5 sm:p-6 md:p-8 rounded-xl shadow-md w-full max-w-md border"
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 text-center text-gray-800">
              Create Account
            </h2>
            <div className="mb-2">
              <label className="text-xs sm:text-sm font-medium">
                Full Name
              </label>
              <input
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full p-2 sm:p-3 border rounded-lg text-xs sm:text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-red-500 text-xs sm:text-sm">{errors.name}</p>
            </div>
            <div className="mb-3">
              <label className="text-xs sm:text-sm font-medium">Email</label>
              <input
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full p-2 sm:p-3 border rounded-lg text-xs sm:text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-red-500 text-xs sm:text-sm">{errors.email}</p>
            </div>
            <div className="mb-3 relative">
              <label className="text-xs sm:text-sm font-medium">Password</label>
              <input
                type={showPass ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full p-2 sm:p-3 border rounded-lg text-xs sm:text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-8 sm:top-9"
              >
                {showPass ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
              <p className="text-red-500 text-xs sm:text-sm">
                {errors.password}
              </p>
            </div>
            <div className="mb-3 relative">
              <label className="text-xs sm:text-sm font-medium">
                Confirm Password
              </label>
              <input
                type={showCPass ? "text" : "password"}
                name="cpassword"
                placeholder="Confirm Password"
                value={form.cpassword}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full p-2 sm:p-3 border rounded-lg text-xs sm:text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowCPass(!showCPass)}
                className="absolute right-3 top-8 sm:top-9"
              >
                {showCPass ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
              <p className="text-red-500 text-xs sm:text-sm">
                {errors.cpassword}
              </p>
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
              {loading ? "Creating User..." : "Sign Up"}
            </button>
            <div className="flex justify-center gap-2 mt-4 text-xs sm:text-sm">
              <p>Already have an account?</p>
              <Link className="text-blue-600 hover:underline" to="/login">
                Sign in
              </Link>
            </div>
          </form>
        </div>
        <div className="hidden md:flex w-1/2 bg-blue-600 text-white items-center justify-center px-8 lg:px-12">
          <div>
            <h1 className="text-3xl lg:text-5xl font-bold mb-4 lg:mb-6">
              Start Shopping
            </h1>
            <p className="text-sm sm:text-base lg:text-lg leading-relaxed">
              Join thousands of happy customers and explore amazing deals, fast
              delivery, and secure payments on our platform.
            </p>
            <div className="mt-6 text-xs sm:text-sm opacity-90">
              Easy signup
              <br />
              Secure account
              <br /> Exclusive member offers
            </div>
          </div>
        </div>
        {showOtpModal && (
          <OtpModal
            otp={otp}
            setOtp={setOtp}
            onVerify={verifySignupOtp}
            onClose={() => setShowOtpModal(false)}
            loading={loadingOtp}
            email={form.email}
            title="Verify Signup OTP"
            buttonText="Verify OTP"
          />
        )}
      </div>
    </>
  );
};

export default Signup;
