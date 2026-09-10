import { useState, useEffect } from "react";
import { MagnifyingGlass, Plus, CircleNotch } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import ExamTableTeacher from "../shared-components/exam-table-teacher";
import Pagination from "../../../components/pagination";
import Button from "../../../components/button";
import Input from "../../../components/input";
import FilterDropdown from "../../../components/filter-dropdown";
import ExamDelete from "./components/exam-delete";
import { useExamsList, useDeleteExam } from "../../../hooks/useExam";
import { useCoursesList } from "../../../hooks/useCourses";
import { useDebounce } from "../../../hooks/useDebounce";
import { useDisclosure } from "../../../hooks/useDisclosure";

const ExamList = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [selectedExam, setSelectedExam] = useState(null);
  const deleteModal = useDisclosure();

  const [selectedCourseId, setSelectedCourseId] = useState("");

  const [pagination, setPagination] = useState({
    current_page: 1,
    limit: 10,
  });

  useEffect(() => {
    setPagination((prev) => ({ ...prev, current_page: 1 }));
  }, [debouncedSearch]);

  const { data: coursesData } = useCoursesList({ limit: 100 });
  const courses = Array.isArray(coursesData) ? coursesData : (coursesData?.data || []);

  const {
    data: examsData,
    isLoading,
    isFetching,
  } = useExamsList({
    page: pagination.current_page,
    limit: pagination.limit,
    search: debouncedSearch,
    course_id: selectedCourseId || undefined,
  });

  const deleteExamMutation = useDeleteExam();

  const exams = examsData?.data || [];
  const queryPagination = examsData?.pagination || {
    current_page: 1,
    total_page: 1,
    total_data: 0,
    limit: 10,
  };

  const loading = isLoading || deleteExamMutation.isPending;

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, current_page: newPage }));
  };

  const handleLimitChange = (newLimit) => {
    setPagination((prev) => ({ ...prev, limit: newLimit, current_page: 1 }));
  };

  const handleAction = (type, row) => {
    if (type === "edit") {
      navigate(`edit/${row.id}`);
    } else if (type === "questions") {
      navigate(`${row.id}/questions`);
    } else if (type === "delete") {
      setSelectedExam(row);
      deleteExamMutation.reset();
      deleteModal.open();
    }
  };

  const handleCourseSelect = (courseId) => {
    setSelectedCourseId(courseId);
    setPagination((prev) => ({ ...prev, current_page: 1 }));
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteExamMutation.mutateAsync(selectedExam.id);
      deleteModal.close();
    } catch (error) {
      console.error("Error deleting exam:", error);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full px-1 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium text-[#1D2939] tracking-tight">
            Manajemen Ujian
          </h1>
          <p className="text-[#475467] mt-0.5">
            Kelola data ujian, jadwal pengerjaan, dan seleksi soal.
          </p>
        </div>
        <div className="flex md:justify-end">
          <Button
            className="w-full md:w-auto h-11"
            onClick={() => navigate("create")}
          >
            <Plus size={20} weight="bold" className="mr-2" />
            Buat Ujian Baru
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        {/* Search & Toolbar Section */}
        <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex items-end gap-3 flex-1">
            <div className="flex-1">
              <Input
                label="Search"
                placeholder="Cari ujian.."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full"
              />
            </div>
            <FilterDropdown
              options={[
                { label: "Semua Mapel", value: "" },
                ...courses.map((course) => ({
                  label: course.title,
                  value: course.id.toString(),
                })),
              ]}
              selectedValue={selectedCourseId}
              onSelect={handleCourseSelect}
              className="w-full md:w-auto"
            />
          </div>
        </div>

        {/* Table Section */}
        <div className="relative min-h-50">
          {loading && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
              <CircleNotch size={32} className="text-[#465FFF] animate-spin" />
            </div>
          )}

          <ExamTableTeacher
            data={exams}
            role="teacher"
            onAction={handleAction}
          />
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={queryPagination.current_page}
          totalPages={queryPagination.total_page}
          onPageChange={handlePageChange}
          limit={pagination.limit}
          onLimitChange={handleLimitChange}
        />
      </div>

      {/* Modals */}
      <ExamDelete
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.close}
        onConfirm={handleDeleteConfirm}
        examName={selectedExam?.title}
        isLoading={deleteExamMutation.isPending}
        error={deleteExamMutation.error}
      />
    </div>
  );
};

export default ExamList;