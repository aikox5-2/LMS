import { useNavigate } from "react-router-dom";
import { Eye } from "@phosphor-icons/react";
import Table from "../../../components/table";
import Button from "../../../components/button";
import Badge from "../../../components/badge";
import { formatDateTimeWithComma } from "../../../utils/date";

const ExamTableStudentHistory = ({ data = [] }) => {
  const navigate = useNavigate();

  const columns = [
    {
      header: "Detail Ujian",
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-medium text-[#344054] truncate">
            {row.title}
          </span>
          <span className="text-xs text-[#475467] line-clamp-1">
            {row.description}
          </span>
        </div>
      ),
    },
    {
      header: "Mata Pelajaran",
      render: (row) => (
        <span className="text-[#475467] line-clamp-2">{row.course}</span>
      ),
    },
    {
      header: "Waktu Selesai",
      render: (row) => (
        <span className="text-[#475467] whitespace-nowrap">
          {formatDateTimeWithComma(row.endTime || row.end_time)}
        </span>
      ),
    },
    {
      header: "Skor (Nilai)",
      className: "text-center",
      render: (row) => {
        const isReview = row.status === "Sedang Review";
        return (
          <div className="flex justify-center">
            <Badge variant={!isReview ? "primary" : "warning"} size="md">
              {isReview ? "Sedang Review" : row.score}
            </Badge>
          </div>
        );
      },
    },
    {
      header: "",
      className: "text-right",
      render: (row) => (
        <Button
          variant="secondary"
          className="w-full lg:w-auto h-10 border-gray-200 cursor-pointer"
          onClick={() => navigate(`/history/detail/${row.id}`)}
        >
          <Eye size={18} />
          Lihat Hasil
        </Button>
      ),
    },
  ];

  return (
    <div className="[&>div]:border-0 [&>div]:shadow-none [&>div]:rounded-none">
      <Table columns={columns} data={data} />
    </div>
  );
};

export default ExamTableStudentHistory;