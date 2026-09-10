import { useState, useEffect } from "react";
import { Plus, Funnel, CircleNotch } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/button";
import Input from "../../components/input";
import Pagination from "../../components/pagination";
import Modal from "../../components/modal";
import CourseTable from "./course-table";
import CourseDelete from "./course-delete";
import { useDisclosure } from "../../hooks/useDisclosure";
import { useCoursesList, useDeleteCourse } from "../../hooks/useCourses";
import { useDebounce } from "../../hooks/useDebounce";

const Course = () => {
  const navigate = useNavigate();
  const deleteModal = useDisclosure();
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [pagination, setPagination] = useState({
    current_page: 1,
    limit: 10,
  });
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    setPagination((prev) => ({ ...prev, current_page: 1 }));
  }, [debouncedSearch]);

  // fetch courses hook
  const {
    data: coursesData,
    isLoading,
    isFetching,
  } = useCoursesList({
    page: pagination.current_page,
    limit: pagination.limit,
    search: debouncedSearch,
  });

  // delete cources hook
  const deleteCourseMutation = useDeleteCourse();

  // courses data
  const courses = coursesData?.data || [];
  const queryPagination = coursesData?.pagination || {
    current_page: 1,
    total_page: 1,
    total_data: 0,
    limit: 10,
  };

  const loading = isLoading || deleteCourseMutation.isPending;

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, current_page: newPage }));
  };

  const handleLimitChange = (newLimit) => {
    setPagination((prev) => ({ ...prev, limit: newLimit, current_page: 1 }));
  };

  const handleEdit = (course) => {
    navigate(`/courses/edit/${course.id}`);
  };

  const handleManageStudents = (course) => {
    navigate(`/courses/${course.id}/students`);
  };

  const handleDeleteConfirm = async (course) => {
    try {
      await deleteCourseMutation.mutateAsync(course.id);
      deleteModal.close();
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full px-1">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium text-[#1D2939] tracking-tight">
            Daftar Mapel / Kelas
          </h1>
          <p className="text-[#475467] mt-0.5">
            Kelola Mapel dan penugasan guru pengampu.
          </p>
        </div>
        <div className="flex md:justify-end">
          <Button
            className="w-full md:w-auto h-11"
            onClick={() => navigate("/courses/create")}
          >
            <Plus size={20} weight="bold" className="mr-2" />
            Buat Mapel Baru
          </Button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Cari mapel..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto relative min-h-50">
        {loading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
            <CircleNotch size={32} className="text-[#465FFF] animate-spin" />
          </div>
        )}

        <CourseTable
          courses={courses}
          currentPage={pagination.current_page}
          limit={pagination.limit}
          onEdit={handleEdit}
          onDelete={(course) => {
            setSelectedCourse(course);
            deleteCourseMutation.reset();
            deleteModal.open();
          }}
          onManageStudents={handleManageStudents}
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

      {/* Delete confirm */}
      <Modal isOpen={deleteModal.isOpen} onClose={deleteModal.close}>
        <CourseDelete
          course={selectedCourse}
          onClose={deleteModal.close}
          onDelete={handleDeleteConfirm}
          isLoading={deleteCourseMutation.isPending}
          error={deleteCourseMutation.error}
        />
      </Modal>
    </div>
  );
};

export default Course;