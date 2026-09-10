import { MagnifyingGlass, Check } from "@phosphor-icons/react";
import Input from "../../components/input";

const StudentListScroll = ({
  students = [],
  selectedStudents = [],
  onToggleStudent,
  onSelectAll,
  searchQuery,
  onSearchChange,
  isLoadingMore,
  onScroll,
  scrollRef,
}) => {
  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.email && s.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const areAllFilteredSelected =
    filteredStudents.length > 0 &&
    filteredStudents.every((s) => selectedStudents.includes(s.id));

  return (
    <div className="flex flex-col gap-4 mt-2">
      <Input
        label="Cari Siswa"
        placeholder="Cari berdasarkan nama atau email siswa..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        suffix={<MagnifyingGlass size={18} className="text-gray-400" />}
      />

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer group">
          <div
            className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
              areAllFilteredSelected
                ? "bg-[#3641f5] border-[#3641f5]"
                : "bg-white border-gray-300 group-hover:border-[#3641f5]"
            }`}
            onClick={() => onSelectAll(filteredStudents)}
          >
            {areAllFilteredSelected && (
              <Check size={12} weight="bold" className="text-white" />
            )}
          </div>
          <span className="text-[14px] font-medium text-[#344054]">
            Pilih Semua Siswa
          </span>
        </label>
        <span className="text-[14px] font-semibold text-[#3641f5]">
          {selectedStudents.length} Siswa Dipilih
        </span>
      </div>

      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="flex flex-col gap-2.5 max-h-80 overflow-y-auto p-4 bg-[#F6F7F8] rounded-xl border border-gray-100"
      >
        {filteredStudents.length > 0 ? (
          filteredStudents.map((student) => {
            const isSelected = selectedStudents.includes(student.id);
            return (
              <div
                key={student.id}
                onClick={() => onToggleStudent(student.id)}
                className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all cursor-pointer bg-white ${
                  isSelected
                    ? "ring-1 ring-inset ring-[#3641f5] border border-[#3641f5]"
                    : "ring-1 ring-inset ring-transparent border border-gray-200 hover:border-gray-300"
                }`}
              >
                <div
                  className={`w-4.5 h-4.5 rounded border flex items-center justify-center transition-all ${
                    isSelected
                      ? "bg-[#3641f5] border-[#3641f5]"
                      : "border-gray-300"
                  }`}
                >
                  {isSelected && (
                    <Check size={12} weight="bold" className="text-white" />
                  )}
                </div>
                <span
                  className={`text-[14px] font-medium ${
                    isSelected ? "text-[#1D2939]" : "text-[#344054]"
                  }`}
                >
                  {student.name}
                </span>
              </div>
            );
          })
        ) : (
          <div className="py-8 text-center text-gray-400 text-sm">
            Tidak ada siswa ditemukan
          </div>
        )}
        {isLoadingMore && (
          <div className="py-2 text-center text-xs text-gray-400 animate-pulse">
            Memuat lebih banyak...
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentListScroll;