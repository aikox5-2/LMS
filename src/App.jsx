import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import User from "./pages/user/User";
import UserForm from "./pages/user/UserForm";
import CourseForm from "./pages/course/CourseForm";
import StudentManagement from "./pages/course/StudentManagement";
import NotFound from "./pages/not-found/NotFound";
import Course from "./pages/course/Course";
import ProtectedRoute from "./components/protected-route";
import Layout from "./layouts/layout";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />

            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/users">
                <Route index element={<User />} />
                <Route path="create" element={<UserForm mode="create" />} />
                <Route path="edit/:id" element={<UserForm mode="edit" />} />
              </Route>
              <Route path="/courses">
              <Route index element={<Course />} />
                <Route path="create" element={<CourseForm mode="create" />} />
                <Route path="edit/:id" element={<CourseForm mode="edit" />} />
                <Route path=":id/students" element={<StudentManagement />} />
              </Route>
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;