import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  CaretLeft,
  Plus,
  CircleNotch,
  FolderSimple,
} from "@phosphor-icons/react";
import Button from "../../components/button";
import Input from "../../components/input";
import Pagination from "../../components/pagination";
import Modal from "../../components/modal";
import FilterDropdown from "../../components/filter-dropdown";
import QuestionTable from "./components/question-table";
import QuestionDelete from "./components/question-delete";
import { useCourseDetail } from "../../hooks/useCourses";
import {
  useQuestionsByCourse,
  useDeleteQuestion,
} from "../../hooks/useQuestions";
import { useDebounce } from "../../hooks/useDebounce";
import { useDisclosure } from "../../hooks/useDisclosure";

const QuestionBank = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const deleteModal = useDisclosure();
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [selectedType, setSelectedType] = useState("");

  const [pagination, setPagination] = useState({
    current_page: 1,
    limit: 10,
  });

  useEffect(() => {
    setPagination((prev) => ({ ...prev, current_page: 1 }));
  }, [debouncedSearch, selectedType]);

  const { data: courseDetail, isLoading: courseLoading } =
    useCourseDetail(courseId);

  const {
    data: questionsData,
    isLoading: questionsLoading,
    isFetching,
  } = useQuestionsByCourse(courseId, {
    page: pagination.current_page,
    limit: pagination.limit,
    search: debouncedSearch,
    type: selectedType || undefined,
  });

  const deleteQuestionMutation = useDeleteQuestion();

  const questions =
    questionsData?.questions || questionsData?.data || (Array.isArray(questionsData) ? questionsData : []);

  const queryPagination = questionsData?.pagination || {
    current_page: 1,
    total_page: 1,
    total_data: 0,
    limit: 10,
  };

  const loading =
    courseLoading || questionsLoading || deleteQuestionMutation.isPending;

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, current_page: newPage }));
  };

  const handleLimitChange = (newLimit) => {
    setPagination((prev) => ({ ...prev, limit: newLimit, current_page: 1 }));
  };

  const handleEdit = (question) => {
    navigate(`/question-bank/course/${courseId}/edit/${question.id}`);
  };

  const handleDeleteConfirm = async (question) => {
    try {
      await deleteQuestionMutation.mutateAsync(question.id);
      deleteModal.close();
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full px-1 pb-10">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <Button
          onClick={() => navigate("/question-bank")}
          className="w-fit"
          variant="secondary"
          glossy
        >
          <CaretLeft size={16} weight="bold" />
          Kembali ke Bank Soal
        </Button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-medium text-[#1D2939] tracking-tight">
              Bank Soal: {courseDetail?.title || "Mata Pelajaran"}
            </h1>
            <p className="text-[#475467] mt-0.5">
              {courseDetail?.description ||
                "Kelola seluruh bank soal untuk mata pelajaran ini."}
            </p>
          </div>

          <div className="flex md:justify-end">
            <Button
              className="w-full md:w-auto h-11"
              onClick={() => navigate(`/question-bank/course/${courseId}/create`)}
            >
              <Plus size={20} weight="bold" className="mr-2" />
              Tambah Soal
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Box */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        {/* Search & Filter Bar */}
        <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex-1">
            <Input
              placeholder="Cari pertanyaan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full"
            />
          </div>

          <FilterDropdown
            options={[
              { label: "Semua Tipe Soal", value: "" },
              { label: "Pilihan Ganda", value: "multiple_choice" },
              { label: "Esai", value: "essay" },
            ]}
            selectedValue={selectedType}
            onSelect={(val) => setSelectedType(val)}
            className="w-full md:w-auto"
          />
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto relative min-h-50">
          {loading && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
              <CircleNotch size={32} className="text-[#465FFF] animate-spin" />
            </div>
          )}

          {questions.length === 0 && !loading ? (
            <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
              <div className="p-4 bg-gray-50 rounded-full text-gray-400">
                <FolderSimple size={32} />
              </div>
              <h3 className="font-semibold text-gray-900 text-lg">
                Belum Ada Soal
              </h3>
              <p className="text-gray-500 text-sm max-w-sm">
                Mata pelajaran ini belum memiliki soal. Klik tombol "Tambah Soal" untuk membuat soal pertama Anda.
              </p>
            </div>
          ) : (
            <QuestionTable
              questions={questions}
              currentPage={pagination.current_page}
              limit={pagination.limit}
              onEdit={handleEdit}
              onDelete={(question) => {
                setSelectedQuestion(question);
                deleteQuestionMutation.reset();
                deleteModal.open();
              }}
            />
          )}
        </div>

        {/* Pagination */}
        {questions.length > 0 && (
          <Pagination
            currentPage={queryPagination.current_page}
            totalPages={queryPagination.total_page || queryPagination.total_pages || 1}
            onPageChange={handlePageChange}
            limit={pagination.limit}
            onLimitChange={handleLimitChange}
          />
        )}
      </div>

      {/* Delete Modal */}
      <Modal isOpen={deleteModal.isOpen} onClose={deleteModal.close}>
        <QuestionDelete
          question={selectedQuestion}
          onClose={deleteModal.close}
          onDelete={handleDeleteConfirm}
          isLoading={deleteQuestionMutation.isPending}
          error={deleteQuestionMutation.error}
        />
      </Modal>
    </div>
  );
};

export default QuestionBank;
