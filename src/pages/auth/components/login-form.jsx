import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Eye, EyeSlash } from "@phosphor-icons/react"; // Sesuaikan jika menggunakan ikon dari library lain
import Input from "../../../components/input"; // Tambahkan import Input sesuai komponen UI kamu
import Button from "../../../components/button"; // Tambahkan import Button sesuai komponen UI kamu

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const { login } = useAuth();
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white flex flex-col gap-8 items-start justify-center px-2 py-4 w-full max-w-106.5 mx-auto">
      <div className="flex flex-col gap-1 items-start justify-center leading-[1.2] w-full">
        <h1 className="font-['DM_Sans',sans-serif] font-medium text-[#344054] text-[24px] w-full">
          Login
        </h1>
        <p className="font-['DM_Sans',sans-serif] font-normal text-[#98a2b3] text-[16px] w-full">
          Masukkan kredensial akun untuk masuk ke dashboard.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
        <div className="flex flex-col gap-3 items-start w-full">
          {/* Email Input */}
          <Input
            label="Email"
            id="email"
            type="email"
            name="email"
            required
            placeholder="example@gmail.com"
            value={formData.email}
            onChange={handleChange}
          />

          {/* Password Input */}
          <Input
            label="Password"
            id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Masukkan password..."
            value={formData.password}
            onChange={handleChange}
            required
            suffix={
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="flex items-center justify-center w-5 focus:outline-none text-[#98a2b3] hover:text-[#344054] transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeSlash size={16} weight="bold" />
                ) : (
                  <Eye size={16} weight="bold" />
                )}
              </button>
            }
          />
        </div>

        <div className="w-full pt-2">
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;