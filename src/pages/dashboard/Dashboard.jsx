import DashboardAdmin from './components/dashboard-admin';
import DashboardTeacher from './components/dashboard-teacher';
import DashboardStudent from './components/dashboard-student';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const { isAdmin, isTeacher, isStudent } = useAuth();

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Role-based Dashboard Components */}
      {isAdmin && <DashboardAdmin />}
      {isTeacher && <DashboardTeacher />}
      {isStudent && <DashboardStudent />}
    </div>
  );
};

export default Dashboard;