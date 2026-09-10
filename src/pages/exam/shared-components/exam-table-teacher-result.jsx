import { useNavigate } from "react-router-dom";
import { Eye } from "@phosphor-icons/react";
import Table from "../../../components/table";
import Button from "../../../components/button";
import Badge from "../../../components/badge";
import { getExamStatusStyle } from "../../../utils/statusMapper";

const ExamTableTeacherResults = ({ data = [] }) => {
  const navigate = useNavigate();

  const renderStatus = (status) => {
    const config = getExamStatusStyle(status);

    return (
      <div className="flex items-center gap-2 font-medium whitespace-nowrap">
        <div className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
        <span className={config.color}>{status}</span>
      </div>
    );
  };

  const columns = [
    {
      header: "No",
      render: (row) => <span className="text-[#475467]">{row.no}</span>,
    },
    {
      header: "Nama Siswa",
      render: (row) => (
        <span className="font-medium text-[#344054] whitespace-nowrap">
          {row.studentName}
        </span>
      ),
    },
    {
      header: "Judul Ujian",
      render: (row) => (
        <span className="text-[#475467] truncate">{row.title}</span>
      ),
    },
    {
      header: "Status",
      className: "text-center",
      render: (row) => (
        <div className="flex justify-center">{renderStatus(row.status)}</div>
      ),
    },
    {
      header: "Skor Akhir",
      className: "text-center",
      render: (row) => {
        const isNeedCorrection = row.score === "Perlu Koreksi";
        const isNotStarted = row.score === "-";
        return (
          <div className="flex justify-center">
            <Badge
              variant={
                isNeedCorrection
                  ? "warning"
                  : isNotStarted
                  ? "secondary"
                  : "primary"
              }
              size="md"
            >
              {row.score}
            </Badge>
          </div>
        );
      },
    },
    {
      header: "Tindakan",
      className: "text-right",
      render: (row) => {
        const isNeedCorrection = row.score === "Perlu Koreksi";
        const queryParams =
          row.examId && row.userId
            ? `?exam_id=${row.examId}&user_id=${row.userId}`
            : "";
        return (
          <Button
            variant="outline"
            className={`h-9 px-3 gap-2 border-gray-200 transition-colors ${
              isNeedCorrection
                ? "text-[#B54708] hover:bg-orange-50 hover:border-orange-200"
                : "text-gray-700 hover:bg-gray-50 cursor-pointer"
            }`}
            onClick={() =>
              navigate(`/results/correction/${row.id}${queryParams}`)
            }
          >
            <Eye size={18} />
            Review
          </Button>
        );
      },
    },
  ];

  return (
    <div className="[&>div]:border-0 [&>div]:shadow-none [&>div]:rounded-none">
      <Table columns={columns} data={data} />
    </div>
  );
};

export default ExamTableTeacherResults;