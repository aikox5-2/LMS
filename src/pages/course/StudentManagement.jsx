import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CaretLeft, CircleNotch } from "@phosphor-icons/react";
import { useUsersList } from "../../hooks/useUsers";
import { useCourseDetail, useUpdateCourse } from "../../hooks/useCourses";
import { toast } from "sonner";
import Button from "../../components/button";
import StudentListScroll from "../course/student-list-scroll";

const StudentManagement = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const scrollContainerRef = useRef(null);

  const [selectedStudents, setSelectedStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleBack = () => navigate("/courses");

  // Fetch student list
  const { data: studentsData } = useUsersList({ role: "student", limit: 100 });
  const students = studentsData?.data || [];

  // Fetch course details
  const { data: courseDetail, isLoading: loading } = useCourseDetail(id);

  const updateCourseMutation = useUpdateCourse();

  useEffect(() => {
    if (courseDetail && courseDetail.students) {
      setSelectedStudents(courseDetail.students.map((s) => s.id));
    }
  }, [courseDetail]);

  const toggleStudent = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAll = (filteredStudents) => {
    const allFilteredIds = filteredStudents.map((s) => s.id);
    const areAllSelected = allFilteredIds.every((id) =>
      selectedStudents.includes(id)
    );

    if (areAllSelected) {
      setSelectedStudents((prev) =>
        prev.filter((id) => !allFilteredIds.includes(id))
      );
    } else {
      setSelectedStudents((prev) => [
        ...new Set([...prev, ...allFilteredIds]),
      ]);
    }
  };

  const saving = updateCourseMutation.isPending;

  const handleSave = async () => {
    if (!courseDetail) return;
    const payload = {
      title: courseDetail.title,
      description: courseDetail.description,
      teacher_id: courseDetail.teacher?.id,
      student_ids: selectedStudents,
    };

    try {
      await updateCourseMutation.mutateAsync({ id, data: payload });
      navigate("/courses");
    } catch (error) {
      console.error("Error saving students:", error);
      toast.error("Gagal memperbarui daftar siswa");
    }
  };

  return (
    <div className="flex flex-col w-full bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden relative">
      {(loading || saving) && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
          <CircleNotch size={32} className="text-[#465FFF] animate-spin" />
        </div>
      )}

      {/* Header & Content */}
      <div className="p-6 lg:p-8 flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Left Side: Info */}
        <div className="flex flex-col gap-4 lg:w-1/3">
          <Button
            onClick={handleBack}
            className="w-fit"
            variant="secondary"
            glossy
          >
            <CaretLeft size={16} weight="bold" />
            Kembali
          </Button>

          <div className="mt-2">
            <h2 className="text-2xl font-bold text-[#1D2939]">
              Kelola Siswa
            </h2>
            <p className="text-[#475467] mt-1 line-clamp-3">
              Kelola daftar siswa untuk mata pelajaran {courseDetail?.title || "..."}.
              Pilih siswa yang ingin didaftarkan ke kelas ini.
            </p>
          </div>
        </div>

        {/* Right Side: Student List Scroll */}
        <div className="flex flex-col gap-5 lg:flex-1 max-w-2xl">
          <StudentListScroll
            students={students}
            selectedStudents={selectedStudents}
            onToggleStudent={toggleStudent}
            onSelectAll={handleSelectAll}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            isLoadingMore={false}
            scrollRef={scrollContainerRef}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 lg:px-8 lg:py-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/30">
        <Button
          variant="secondary"
          glossy
          onClick={handleBack}
          disabled={saving}
        >
          Batal
        </Button>
        <Button onClick={handleSave} disabled={saving || loading}>
          {saving ? (
            <>
              <CircleNotch size={18} className="animate-spin mr-2" />
              Menyimpan...
            </>
          ) : (
            "Simpan"
          )}
        </Button>
      </div>
    </div>
  );
};

export default StudentManagement;