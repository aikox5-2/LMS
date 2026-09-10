import { PencilSimpleLine, TrashSimple } from "@phosphor-icons/react";
import Table from "../../../components/table";
import Button from "../../../components/button";
import Badge from "../../../components/badge";

const QuestionTable = ({
  questions = [],
  currentPage = 1,
  limit = 10,
  onEdit,
  onDelete,
}) => {
  const columns = [
    {
      header: "Id",
      render: (row) => (currentPage - 1) * limit + questions.indexOf(row) + 1,
      className: "w-[60px] text-gray-500",
    },
    {
      header: "Daftar Pertanyaan",
      render: (row) => (
        <div className="flex flex-col max-w-100">
          <span className="font-medium text-[#344054] leading-relaxed line-clamp-4">
            {row.question_text}
          </span>
        </div>
      ),
    },
    {
      header: "Tipe Soal",
      render: (row) => {
        const displayType =
          row.type === "multiple_choice"
            ? "Pilihan Ganda"
            : "Esai";
        return (
          <div className="flex justify-start">
            <Badge variant="primary">{displayType}</Badge>
          </div>
        );
      },
    },
    {
      header: "Ujian Tertaut",
      render: (row) => (
        <div className="flex justify-start">
          <Badge variant="primary">{row.total_exams} Ujian</Badge>
        </div>
      ),
    },
  ];

  return (
    <div className="[&>div]:border-0 [&>div]:shadow-none [&>div]:rounded-none">
      <Table
        columns={columns}
        data={questions}
        renderActions={(row, closeMenu) => (
          <div className="flex flex-col">
            <Button
              variant="ghost"
              className="justify-start! rounded-none! h-10 px-4 gap-2.5"
              onClick={() => {
                onEdit?.(row);
                closeMenu();
              }}
            >
              <PencilSimpleLine size={18} className="text-gray-500" />
              <span className="font-medium text-gray-700">Edit Soal</span>
            </Button>
            <div className="border-t border-gray-100" />
            <Button
              variant="ghostDestructive"
              className="justify-start! rounded-none! h-10 px-4 gap-2.5"
              onClick={() => {
                onDelete?.(row);
                closeMenu();
              }}
            >
              <TrashSimple size={18} />
              <span className="font-medium">Delete Soal</span>
            </Button>
          </div>
        )}
      />
    </div>
  );
};

export default QuestionTable;