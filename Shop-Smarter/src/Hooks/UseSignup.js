import Api from "../Api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function useSignup() {
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [showCPass, setShowCPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
  });

  const validateField = (name, value) => {
    let error = "";
    if (name === "name") {
      if (!value.trim()) error = "Full Name is required";
      else if (value.trim().length < 3)
        error = "Name must be at least 3 characters";
    }
    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value.trim()) error = "Email is required";
      else if (!emailRegex.test(value)) error = "Invalid email format";
    }
    if (name === "phone") {
      const phoneRegex = /^\d{10}$/;
      if (!value.trim()) error = "Phone Number is required";
      else if (!phoneRegex.test(value)) error = "Invalid phone format";
    }
    if (name === "password") {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
      if (!value) error = "Password is required";
      else if (!passwordRegex.test(value))
        error = "8+ chars with upper, lower & number";
    }
    if (name === "cpassword") {
      if (!value) error = "Confirm Password required";
      else if (value !== form.password) error = "Passwords do not match";
    }
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
    return error;
  };

  const verifySignupOtp = async () => {
    if (!otp.trim()) return toast.error("Enter OTP");
    try {
      setLoadingOtp(true);
      const res = await Api.post("/verifyOtp",
        {
          email: form.email,
          otp,
        },
      );
      toast.success(res.data.message);
      setShowOtpModal(false);
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP failed");
    } finally {
      setLoadingOtp(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let hasError = false;
    Object.keys(form).forEach((key) => {
      const error = validateField(key, form[key]);
      if (error) {
        toast.error(error);
        hasError = true;
      }
    });
    if (hasError) return;
    try {
      setLoading(true);

      const res = await Api.post("/signup", {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
      toast.success(res.data.message);
      setShowOtpModal(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };
  return {
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
    setLoading,
  };
}
