import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Play,
  Eye,
  Lock,
  CircleNotch,
} from "@phosphor-icons/react";
import Table from "../../../components/table";
import Button from "../../../components/button";
import Badge from "../../../components/badge";
import { examService } from "../../../services/examService";
import { formatDateTimeWithComma } from "../../../utils/date";
import { getExamStatusStyle } from "../../../utils/statusMapper";
import { toast } from "sonner";

const ExamTableStudent = ({ data = [] }) => {
  const navigate = useNavigate();
  const [startingExamId, setStartingExamId] = useState(null);

  const handleStartExam = async (examId) => {
    setStartingExamId(examId);
    try {
      const response = await examService.startExam(examId);
      if (response.success) {
        navigate(`/active-exams/${examId}/take`);
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

  const renderStatus = (status) => {
    const config = getExamStatusStyle(status);

    return (
      <div className="flex items-center gap-2 font-medium whitespace-nowrap">
        <div className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
        <span className={config.color}>{status}</span>
      </div>
    );
  };

  const renderStudentAction = (row) => {
    if (row.status === "Sedang Ujian") {
      return (
        <Button
          variant="primary"
          className=""
          onClick={() => navigate(`/active-exams/${row.id}/take`)}
        >
          <Play size={18} weight="fill" />
          Lanjutkan Ujian
        </Button>
      );
    }

    if (row.status === "Tersedia") {
      const isStarting = startingExamId === row.id;
      return (
        <Button
          variant="primary"
          className="w-full lg:w-auto h-10 cursor-pointer"
          onClick={() => handleStartExam(row.id)}
          disabled={isStarting}
        >
          {isStarting ? (
            <CircleNotch size={18} className="animate-spin mr-2" />
          ) : (
            <Play size={18} weight="fill" />
          )}
          {isStarting ? "Memulai..." : "Mulai Ujian"}
        </Button>
      );
    }

    if (row.status === "Belum Mulai") {
      return (
        <Button
          disabled
          variant="secondary"
          className="w-full lg:w-auto h-10 border-gray-100 text-gray-400 opacity-60 pointer-events-none"
        >
          Menunggu...
        </Button>
      );
    }

    return (
      <Button
        disabled
        variant="secondary"
        className="w-full lg:w-auto h-10 border-gray-100 text-red-500 opacity-100! pointer-events-none"
      >
        <Lock size={18} />
        Ujian Ditutup
      </Button>
    );
  };

  const studentColumns = [
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
        <span className="text-[#475467] line-clamp-2">{row.course?.title}</span>
      ),
    },
    {
      header: "Waktu Mulai",
      render: (row) => (
        <span className="text-[#475467] whitespace-nowrap">
          {formatDateTimeWithComma(row.startTime || row.start_time)}
        </span>
      ),
    },
    {
      header: "Durasi",
      className: "text-center",
      render: (row) => (
        <div className="flex justify-center">
          <Badge variant="primary">{row.duration} Menit</Badge>
        </div>
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
      header: "",
      className: "text-right",
      render: (row) => renderStudentAction(row),
    },
  ];

  return (
    <div className="[&>div]:border-0 [&>div]:shadow-none [&>div]:rounded-none">
      <Table columns={studentColumns} data={data} />
    </div>
  );
};

export default ExamTableStudent;