import { CircleNotch, FolderSimple } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import { useCoursesList } from "../../hooks/useCourses";
import CourseCard from "./components/course-card";

const CourseList = () => {
  const navigate = useNavigate();
  const { data: coursesData, isLoading, error } = useCoursesList({ limit: 100 });
  const courses = Array.isArray(coursesData) ? coursesData : (coursesData?.data || []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-80 w-full gap-3">
        <CircleNotch size={40} className="text-[#3641f5] animate-spin" />
        <span className="text-gray-500 font-medium text-sm">
          Memuat daftar mata pelajaran...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-80 w-full text-red-500 font-medium">
        Gagal memuat daftar mata pelajaran.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full px-1">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-medium text-[#1D2939] tracking-tight">
          Daftar Mapel
        </h1>
        <p className="text-[#475467] mt-0.5">
          Pilih mata pelajaran untuk melihat dan mengelola bank soal.
        </p>
      </div>

      {courses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center flex flex-col items-center justify-center gap-3">
          <div className="p-4 bg-gray-50 rounded-full text-gray-400">
            <FolderSimple size={32} />
          </div>
          <h3 className="font-semibold text-gray-900 text-lg">
            Tidak ada Mata Pelajaran
          </h3>
          <p className="text-gray-500 text-sm max-w-sm">
            Anda belum ditugaskan ke mata pelajaran apapun. Silakan hubungi
            Administrator.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onClick={() => navigate(`/question-bank/course/${course.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseList;