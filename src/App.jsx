import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useState } from "react";
import Button from "./components/button";
import Input from "./components/input";
import Modal from "./components/modal";
import Layout from "./layouts/layout";
import Login from "./pages/auth/Login";
import ProtectedRoute from "./components/protected-route";

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute allowedRoles={["admin", "teacher", "student"]} />}>
          <Route path="/dashboard" element={<Layout />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;