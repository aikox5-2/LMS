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
import ExamList from "./pages/exam/management/ExamList";
import ExamForm from "./pages/exam/management/ExamForm";
import QuestionManagement from "./pages/exam/management/QuestionManagement";
import CourseList from "./pages/question-bank/CourseList";
import QuestionBank from "./pages/question-bank/QuestionBank";
import QuestionForm from "./pages/question-bank/QuestionForm";
import ActiveExams from "./pages/exam/session/ActiveExams";
import ExamWorkspace from "./pages/exam/session/ExamWorkspace";
import StudentResultDetail from "./pages/exam/result/StudentResultDetail";
import ExamHistory from "./pages/exam/result/ExamHistory";
import CorrectionDetail from "./pages/exam/result/CorrectionDetail";
import ExamMonitoring from "./pages/exam/monitoring/ExamMonitoring";


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
              <Route path="/monitor" element={<ExamMonitoring />} />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={['teacher']} />}>
              <Route path="/exams">
                <Route index element={<ExamList />} />
                <Route path="create" element={<ExamForm mode="create" />} />
                <Route path="edit/:id" element={<ExamForm mode="edit" />} />
                <Route path=":id/questions" element={<QuestionManagement />} />
              </Route>
              <Route path="/question-bank">
                <Route index element={<CourseList />} />
                <Route path="course/:courseId" element={<QuestionBank />} />
                <Route path="course/:courseId/create" element={<QuestionForm mode="create" />} />
                <Route path="course/:courseId/edit/:questionId" element={<QuestionForm mode="edit" />} />
              </Route>
              <Route path="/results">
                <Route index element={<ExamHistory />} />
                <Route path="correction/:id" element={<CorrectionDetail />} />
              </Route>
            </Route>
            <Route element={<ProtectedRoute allowedRoles={['student']} />}>
              <Route path="/active-exams">
                <Route index element={<ActiveExams />} />
                <Route path="detail/:id" element={<StudentResultDetail />} />
              </Route>
              <Route path="/history">
                <Route index element={<ExamHistory />} />
                <Route path="detail/:id" element={<StudentResultDetail />} />
              </Route>
              <Route path="/active-exams/:id/take">
                <Route index element={<ExamWorkspace />} />
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