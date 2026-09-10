import { useNavigate } from "react-router-dom";
import { PencilSimpleLine, ListChecks, Trash } from "@phosphor-icons/react";
import Table from "../../../components/table";
import Button from "../../../components/button";
import Badge from "../../../components/badge";
import { formatDateTimeWithComma } from "../../../utils/date";

const ExamTableTeacher = ({ data = [], onAction }) => {
  const navigate = useNavigate();

  const teacherColumns = [
    {
      header: "Ujian",
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
      header: "Waktu Mulai - Selesai",
      render: (row) => (
        <span className="text-[#475467] whitespace-nowrap">
          {formatDateTimeWithComma(row.start_time)} s/d{" "}
          {formatDateTimeWithComma(row.end_time)}
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
  ];

  return (
    <div className="[&>div]:border-0 [&>div]:shadow-none [&>div]:rounded-none">
      <Table
        columns={teacherColumns}
        data={data}
        renderActions={(row, closeMenu) => (
          <div className="flex flex-col">
            <Button
              variant="ghost"
              className="justify-start! rounded-none! h-10 px-4 gap-2.5"
              onClick={() => {
                onAction?.("edit", row);
                closeMenu();
              }}
            >
              <PencilSimpleLine size={18} className="text-gray-500" />
              <span className="font-medium text-gray-700">Edit Ujian</span>
            </Button>
            <Button
              variant="ghost"
              className="justify-start! rounded-none! h-10 px-4 gap-2.5"
              onClick={() => {
                onAction?.("questions", row);
                closeMenu();
              }}
            >
              <ListChecks size={18} className="text-gray-500" />
              <span className="font-medium text-gray-700">Kelola Soal</span>
            </Button>
            <div className="border-t border-gray-100" />
            <Button
              variant="ghostDestructive"
              className="justify-start! rounded-none! h-10 px-4 gap-2.5"
              onClick={() => {
                onAction?.("delete", row);
                closeMenu();
              }}
            >
              <Trash size={18} />
              <span className="font-medium">Delete Ujian</span>
            </Button>
          </div>
        )}
      />
    </div>
  );
};

export default ExamTableTeacher;