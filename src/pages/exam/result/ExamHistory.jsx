import React, { useState, useEffect } from "react";
import { CircleNotch } from "@phosphor-icons/react";
import { useLocation } from "react-router-dom";
import ExamTableStudentHistory from "../shared-components/exam-table-student-history";
import ExamTableTeacherResults from "../shared-components/exam-table-teacher-result";
import Pagination from "../../../components/pagination";
import Input from "../../../components/input";
import FilterDropdown from "../../../components/filter-dropdown";
import { useAttemptsForTeacher, useMyAttempts } from "../../../hooks/useExam";
import { useDebounce } from "../../../hooks/useDebounce";

const ExamHistory = () => {
  const location = useLocation();
  const isTeacher = location.pathname === "/results";
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const handleStatusSelect = (status) => {
    setSelectedStatus(status);
    setPage(1);
  };

  const {
    data: teacherAttemptsData,
    isLoading: teacherLoading,
    error: teacherError,
  } = useAttemptsForTeacher(isTeacher, {
    page,
    limit,
    search: debouncedSearch || undefined,
    status: selectedStatus || undefined,
  });

  const {
    data: studentAttemptsData,
    isLoading: studentLoading,
    error: studentError,
  } = useMyAttempts(!isTeacher, { page, limit, search: debouncedSearch });

  const loading = isTeacher ? teacherLoading : studentLoading;
  const queryError = isTeacher ? teacherError : studentError;
  const error = queryError ? "Gagal memuat data riwayat ujian." : "";

  const data = React.useMemo(() => {
    if (isTeacher) {
      if (!teacherAttemptsData) return [];
      const list = Array.isArray(teacherAttemptsData.data)
        ? teacherAttemptsData.data
        : Array.isArray(teacherAttemptsData)
        ? teacherAttemptsData
        : [];
      return list.map((item, index) => ({
        id: item.attempt_id,
        no: (page - 1) * limit + index + 1,
        studentId: item.attempt_id,
        studentName: item.student_name,
        title: item.exam_title,
        status:
          item.status === "completed"
            ? "Sedang Review"
            : item.status === "graded"
            ? "Selesai"
            : "Sedang Ujian",
        score: item.score !== null ? String(item.score) : "Perlu Koreksi",
        examId: item.exam_id,
        userId: item.user_id,
      }));
    } else {
      if (!studentAttemptsData) return [];
      const list = Array.isArray(studentAttemptsData.data)
        ? studentAttemptsData.data
        : Array.isArray(studentAttemptsData)
        ? studentAttemptsData
        : [];
      return list.map((item) => ({
        id: item.exam_id,
        title: item.exam_title,
        description: item.exam_description || "",
        course: item.course_title,
        endTime: item.end_time,
        score: item.score,
        status: item.status === "completed" ? "Sedang Review" : "Selesai",
      }));
    }
  }, [isTeacher, teacherAttemptsData, studentAttemptsData, page, limit]);

  const pagination = React.useMemo(() => {
    const defaultPagination = {
      total_data: 0,
      total_page: 1,
      current_page: 1,
      limit: 10,
    };
    if (isTeacher) {
      return teacherAttemptsData?.pagination || defaultPagination;
    } else {
      return studentAttemptsData?.pagination || defaultPagination;
    }
  }, [isTeacher, teacherAttemptsData, studentAttemptsData]);

  return (
    <div className="flex flex-col gap-6 w-full px-1 pb-10">
      {/* Header Section */}
      <div>
        <h1 className="text-2xl font-medium text-[#1D2939] tracking-tight">
          {isTeacher ? "Hasil & Evaluasi" : "Riwayat & Hasil Ujian"}
        </h1>
        <p className="text-[#475467] mt-0.5">
          {isTeacher
            ? "Pengelolaan dan penyusunan soal ujian dalam satu tempat."
            : "Lihat detail skor dan review dari ujian yang telah diselesaikan."}
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        {/* Search & Toolbar Section */}
        <div className="p-5 border-b border-gray-100 flex flex-col gap-4">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <Input
                label="Search"
                placeholder={
                  isTeacher ? "Cari soal.." : "Cari riwayat ujian.."
                }
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full"
              />
            </div>

            {isTeacher && (
              <div>
                <FilterDropdown
                  options={[
                    { label: "Semua Status", value: "" },
                    { label: "Sedang Ujian", value: "in_progress" },
                    { label: "Sedang Review", value: "completed" },
                    { label: "Selesai", value: "graded" },
                  ]}
                  selectedValue={selectedStatus}
                  onSelect={handleStatusSelect}
                />
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <CircleNotch size={32} className="text-[#3641f5] animate-spin" />
            <span className="text-gray-500 font-medium text-sm">
              Memuat data...
            </span>
          </div>
        ) : error ? (
          <div className="text-center py-16 text-red-500 font-medium">
            {error}
          </div>
        ) : isTeacher ? (
          <ExamTableTeacherResults data={data} />
        ) : (
          <ExamTableStudentHistory data={data} />
        )}

        <Pagination
          currentPage={page}
          totalPages={pagination.total_page}
          onPageChange={(p) => setPage(p)}
          itemsPerPage={limit}
          onItemsPerPageChange={(l) => {
            setLimit(l);
            setPage(1);
          }}
          totalItems={pagination.total_data}
        />
      </div>
    </div>
  );
};

export default ExamHistory;