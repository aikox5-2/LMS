import Button from "../../../components/button";
import MonitorCard from "./components/monitor-card";
import { useActiveExams } from "../../../hooks/useExamMonitor";
import { ArrowsCounterClockwise, CircleNotch } from "@phosphor-icons/react";

const ExamMonitoring = () => {
  const {
    data: activeExams = [],
    isLoading,
    isFetching,
    refetch,
  } = useActiveExams();
  const loading = isLoading || isFetching;

  return (
    <div className="flex flex-col gap-6 w-full px-1 pb-10">
      {/* Header Page Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 ">
            <div className="w-3 h-3 rounded-full bg-green-600 animate-pulse" />
            <span className="text-xl font-medium text-[#1D2939]">
              Live Monitor Ujian
            </span>
          </div>
        </div>
        <div className="flex md:justify-end">
          <Button
            variant="secondary"
            className="w-full md:w-auto h-10 border-gray-200"
            onClick={() => refetch()}
            disabled={loading}
          >
            <ArrowsCounterClockwise
              size={18}
              weight="bold"
              className={`mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Segarkan Data
          </Button>
        </div>
      </div>

      {/* List of Monitoring Cards */}
      <div className="relative min-h-60 mt-2">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <CircleNotch size={36} className="text-[#465FFF] animate-spin" />
          </div>
        ) : activeExams.length > 0 ? (
          <div className="flex flex-col gap-8">
            {activeExams.map((exam) => (
              <MonitorCard key={exam.id} exam={exam} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <span className="text-sm font-semibold text-gray-500">
              Tidak ada ujian aktif saat ini
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamMonitoring;