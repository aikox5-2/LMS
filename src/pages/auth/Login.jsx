import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";
import LoginForm from "./components/login-form";

// Impor asset gambar (sesuaikan path gambar jika berbeda)
import authDecoration from "../../assets/auth-decoration.png";
import whiteLogo from "../../assets/white-logo.svg";
import dashboardAdmin from "../../assets/dashboard-admin.png";

const Login = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, loading, navigate]);

  return (
    <div className="h-screen w-full flex bg-white">
      <div className="hidden lg:flex lg:w-1/2 p-2">
        <div className="w-full h-full rounded-4xl bg-linear-to-br from-[#465FFF] to-[#3641F5] flex flex-col items-center justify-between p-8 xl:p-12 relative overflow-hidden">
          <img
            src={authDecoration}
            alt=""
            className="absolute top-[-10%] left-[-40%] w-[80%] pointer-events-none"
          />
          <img
            src={authDecoration}
            alt=""
            className="absolute bottom-[-10%] right-[-10%] w-[80%] pointer-events-none"
          />

          <div className="flex-1 flex flex-col items-center justify-center w-full z-10 py-2 min-h-0">
            <img
              src={whiteLogo}
              alt="Logo Sekolah"
              className="w-[8vh] h-[8vh] max-w-12 max-h-12 min-w-9 min-h-9 object-contain mb-[2.5vh]"
            />
            <h2 className="text-white text-[2.8vh] xl:text-4xl font-bold text-center leading-tight mb-[3.5vh]">
              Web Ujian Sekolah
              <br />
              Berbasis Digital Online
            </h2>
            <img
              src={dashboardAdmin}
              alt=""
              className="w-full max-w-[95%] max-h-[48vh] xl:max-h-[52vh] rounded-lg object-contain"
            />
          </div>

          <div className="z-10 mt-auto pt-6">
            <p className="text-white/80 text-xs xl:text-sm font-medium">
              © 2026 Web Ujian Online Sekolah. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-2 sm:p-12">
        <div className="w-full max-w-106.5">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;