import { useState, useEffect } from "react";
import ExamTableStudent from "../shared-components/exam-table-student";
import Input from "../../../components/input";
import Pagination from "../../../components/pagination";
import FilterDropdown from "../../../components/filter-dropdown";
import { useMyExamsList } from "../../../hooks/useExam";
import { useDebounce } from "../../../hooks/useDebounce";
import { CircleNotch } from "@phosphor-icons/react";
import {
  formatExamStatus,
  getBackendStatus,
} from "../../../utils/statusMapper";

const ActiveExams = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, selectedStatus]);

  const { data: examsData, isLoading } = useMyExamsList({
    page,
    limit,
    search: debouncedSearch,
    status: getBackendStatus(selectedStatus),
  });

  const loading = isLoading;

  const handleStatusSelect = (status) => {
    setSelectedStatus(status);
  };

  const examsList = Array.isArray(examsData?.data)
    ? examsData.data
    : Array.isArray(examsData)
    ? examsData
    : [];

  const pagination = examsData?.pagination || {
    total_data: 0,
    total_pages: 1,
    current_page: 1,
    limit: 10,
  };

  const formattedExams = examsList.map((exam) => {
    return {
      id: exam.id,
      title: exam.title,
      description: exam.description,
      course: exam.course,
      startTime: exam.start_time,
      duration: exam.duration,
      status: formatExamStatus(exam.status),
    };
  });

  const displayData = formattedExams;

  return (
    <div className="flex flex-col gap-6 w-full px-1 pb-10 relative">
      {/* Header Section */}
      <div>
        <h1 className="text-2xl font-medium text-[#1D2939] tracking-tight">
          Daftar Ujian Saya
        </h1>
        <p className="text-[#475467] mt-0.5">
          Pilah dan kerjakan ujian yang telah ditugaskan untuk Anda.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm min-h-60 relative">
        {loading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
            <CircleNotch size={32} className="text-[#465FFF] animate-spin" />
          </div>
        )}

        {/* Search & Toolbar Section */}
        <div className="p-5 border-b border-gray-100 flex items-end gap-3">
          <div className="flex-1">
            <Input
              label="Search"
              placeholder="Cari ujian.."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <FilterDropdown
              options={[
                { label: "Semua Status", value: "" },
                ...["Tersedia", "Belum Mulai", "Sedang Ujian", "Terlewat"].map(
                  (status) => ({
                    label: status,
                    value: status,
                  })
                ),
              ]}
              selectedValue={selectedStatus}
              onSelect={handleStatusSelect}
            />
          </div>
        </div>

        {/* Table Section */}
        <ExamTableStudent data={displayData} role="student" />

        {/* Pagination */}
        <Pagination
          currentPage={page}
          totalPages={pagination.total_pages}
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

export default ActiveExams;