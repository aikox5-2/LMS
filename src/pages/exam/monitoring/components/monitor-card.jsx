import { useState } from "react";
import { Clock, CircleNotch } from "@phosphor-icons/react";
import MonitorTable from "./monitor-table";
import Pagination from "../../../../components/pagination";
import {
  useExamMonitorDetails,
  useExamMonitorSocket,
} from "../../../../hooks/useExamMonitor";

const MonitorCard = ({ exam }) => {
  const [pagination, setPagination] = useState({
    current_page: 1,
    limit: 10,
  });

  const { data, isLoading, isFetching } = useExamMonitorDetails(
    exam.id,
    pagination.current_page,
    pagination.limit,
  );

  // Bind WebSocket listener for live student attempts updates
  useExamMonitorSocket(exam.id);

  const attempts = data?.attempts || [];
  const totalPages = data?.pagination?.total_page || 1;
  const loading = isLoading || isFetching;

  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(16,24,40,0.1),0_1px_2px_rgba(16,24,40,0.06)] overflow-hidden flex flex-col transition-all duration-300"
    >
      {/* Exam Info Header */}
      <div className="p-6 pb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-[#1D2939]">{exam.title}</h3>
          <div className="flex items-center gap-2 mt-1 text-gray-400">
            <Clock size={16} />
            <span className="text-sm font-normal">
              Berakhir pada:{" "}
              {new Date(exam.end_time || exam.endTime).toLocaleString("id-ID")}
            </span>
          </div>
        </div>
        {loading && (
          <CircleNotch size={20} className="text-[#465FFF] animate-spin" />
        )}
      </div>

      {/* Table Area */}
      <div className="overflow-x-auto relative min-h-32">
        <MonitorTable students={attempts} />
      </div>

      {/* Pagination Area */}
      <Pagination
        currentPage={pagination.current_page}
        totalPages={totalPages}
        onPageChange={(newPage) =>
          setPagination((prev) => ({ ...prev, current_page: newPage }))
        }
        limit={pagination.limit}
        onLimitChange={(newLimit) =>
          setPagination((prev) => ({
            ...prev,
            limit: newLimit,
            current_page: 1,
          }))
        }
      />
    </div>
  );
};

export default MonitorCard;