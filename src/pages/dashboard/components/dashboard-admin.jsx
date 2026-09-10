import { Books, Broadcast, CircleNotch, Medal, Users } from "@phosphor-icons/react";
import AverageScoreChart from "./average-score";
import MetricCard from "./metric-card";
import UserComposition from "./user-composition";
import { useAdminStats } from "../../../hooks/useDashboard";

const DashboardAdmin = () => {
  const { data: stats, isLoading, error } = useAdminStats();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-80 w-full">
        <div className="flex flex-col items-center gap-3">
          <CircleNotch size={40} className="text-[#3641f5] animate-spin" />
          <span className="text-gray-500 font-medium text-sm">Memuat Dashboard Admin...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-80 w-full text-red-500 font-medium">
        Gagal memuat data statistik dashboard.
      </div>
    );
  }

  const metrics = [
    {
      label: 'Total Users',
      value: String(stats?.card_stats?.total_users || 0),
      icon: Users
    },
    {
      label: 'Kursus Aktif',
      value: String(stats?.card_stats?.total_courses || 0),
      icon: Books
    },
    {
      label: 'Ujian Berlangsung',
      value: String(stats?.card_stats?.ongoing_exams || 0),
      icon: Broadcast
    },
    {
      label: 'Rata-Rata Nilai',
      value: String(stats?.card_stats?.average_score || 0),
      icon: Medal
    }
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((item, index) => (
          <MetricCard
            key={index}
            label={item.label}
            value={item.value}
            icon={item.icon}
          />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AverageScoreChart chartData={stats?.course_averages || []} />
        <UserComposition compositionData={stats?.user_composition || []} />
      </div>
    </div>
  );
};

export default DashboardAdmin;