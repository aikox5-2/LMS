import { UserIcon } from "@phosphor-icons/react";
import Table from "../../../../components/table";
import Badge from "../../../../components/badge";
import { getExamStatusStyle } from "../../../../utils/statusMapper";

const MonitorTable = ({ students = [] }) => {
  const columns = [
    {
      header: "Siswa",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center w-8 h-8 rounded-sm bg-[#EEF4FF] shrink-0"
          >
            <UserIcon size={20} weight="fill" className="text-[#3641F5]" />
          </div>
          <span className="font-medium text-[#344054] text-sm whitespace-nowrap">
            {row.user?.name || "Siswa"}
          </span>
        </div>
      ),
    },
    {
      header: "Waktu Mulai",
      render: (row) => (
        <span className="text-gray-500 font-normal text-sm whitespace-nowrap">
          {row.start_time
            ? new Date(row.start_time).toLocaleString("id-ID")
            : "-"}
        </span>
      ),
    },
    {
      header: "Skor (Nilai)",
      className: "text-center",
      render: (row) => {
        const hasScore = row.score !== null && row.score !== undefined;
        return (
          <div className="flex justify-center">
            <Badge variant={hasScore ? "primary" : "secondary"} size="md">
              {hasScore ? row.score : "-"}
            </Badge>
          </div>
        );
      },
    },
    {
      header: "Status",
      className: "text-right",
      render: (row) => {
        const isFinished =
          row.status === "completed" || row.status === "graded";
        const statusLabel = isFinished ? "Selesai" : "Sedang Ujian";
        const config = getExamStatusStyle(statusLabel);
        return (
          <div className="flex items-center justify-end gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
            <span
              className={`text-sm font-medium whitespace-nowrap ${config.color}`}
            >
              {statusLabel}
            </span>
          </div>
        );
      },
    },
  ];

  return (
    <div className="[&>div]:border-0 [&>div]:shadow-none [&>div]:rounded-none">
      <Table columns={columns} data={students} />
    </div>
  );
};

export default MonitorTable;