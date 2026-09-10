import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  SealCheck,
  BookOpen,
  GraduationCap,
  CircleNotch,
} from "@phosphor-icons/react";
import ExamCard from "./exam-card";
import { useStudentStats } from "../../../hooks/useDashboard";
import { useActiveDashboardExams } from "../../../hooks/useExam";
import { examService } from "../../../services/examService";
import { formatExamStatus } from "../../../utils/statusMapper";
import { toast } from "sonner";
import MetricCard from "./metric-card";

const DashboardStudent = () => {
  const navigate = useNavigate();
  const [startingExamId, setStartingExamId] = useState(null);
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useStudentStats();
  const { data: examsData, isLoading: examsLoading } =
    useActiveDashboardExams();

  const handleStartOrContinue = async (exam) => {
    if (exam.status === "Sedang Ujian") {
      navigate(`/active-exams/${exam.id}/take`);
      return;
    }

    setStartingExamId(exam.id);
    try {
      const response = await examService.startExam(exam.id);
      if (response.success) {
        navigate(`/active-exams/${exam.id}/take`);
      } else {
        toast.error(response.message || "Gagal memulai ujian");
      }
    } catch (error) {
      console.error("Error starting exam:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Terjadi kesalahan saat memulai ujian"
      );
    } finally {
      setStartingExamId(null);
    }
  };

  const loading = statsLoading || examsLoading;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-80 w-full">
        <div className="flex flex-col items-center gap-3">
          <CircleNotch size={40} className="text-[#3641f5] animate-spin" />
          <span className="text-gray-500 font-medium text-sm">
            Memuat Dashboard Siswa...
          </span>
        </div>
      </div>
    );
  }

  if (statsError) {
    return (
      <div className="flex justify-center items-center h-80 w-full text-red-500 font-medium">
        Gagal memuat data statistik dashboard siswa.
      </div>
    );
  }

  const metrics = [
    {
      id: 1,
      label: "Ujian Tersedia",
      value: String(stats?.card_stats?.available_exams || 0),
      icon: FileText,
    },
    {
      id: 2,
      label: "Ujian Selesai",
      value: String(stats?.card_stats?.completed_exams || 0),
      icon: SealCheck,
    },
    {
      id: 3,
      label: "Mapel Diikuti",
      value: String(stats?.card_stats?.enrolled_courses || 0),
      icon: BookOpen,
    },
    {
      id: 4,
      label: "Rata-Rata Nilai",
      value:
        stats?.card_stats?.average_score !== undefined
          ? String(stats.card_stats.average_score)
          : "0",
      icon: GraduationCap,
    },
  ];

  const examsList = Array.isArray(examsData?.data)
    ? examsData.data
    : Array.isArray(examsData)
    ? examsData
    : [];

  const formattedExams = examsList.map((exam) => {
    return {
      id: exam.id,
      title: exam.title,
      description: exam.description,
      course: exam.course,
      status: formatExamStatus(exam.status),
      duration: `${exam.duration || 0} Menit`,
    };
  });

  const activeExams = formattedExams.slice(0, 6);

  return (
    <div className="flex flex-col gap-8">
      {/* Metrics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <MetricCard
            key={metric.id}
            label={metric.label}
            value={metric.value}
            icon={metric.icon}
          />
        ))}
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-medium text-[#1D2939]">
            Ujian Siap Dikerjakan
          </h2>
        </div>

        {activeExams.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-500 font-medium shadow-sm">
            Tidak ada ujian yang siap dikerjakan saat ini.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeExams.map((exam) => (
              <ExamCard
                key={exam.id}
                subject={exam.course}
                duration={exam.duration}
                title={exam.title}
                description={exam.description}
                status={exam.status}
                onStart={() => handleStartOrContinue(exam)}
                loading={startingExamId === exam.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardStudent;