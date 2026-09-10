import { BookOpen, ArrowRight } from "@phosphor-icons/react";

const CourseCard = ({ course, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-100 border-l-4 border-l-[#3641f5] p-5 flex flex-col gap-3 shadow-sm cursor-pointer"
    >
      <div className="flex items-start gap-4">
        <div className="p-2.5 bg-blue-50 rounded-lg text-[#3641f5] shrink-0">
          <BookOpen size={20} weight="bold" />
        </div>
        <div className="flex flex-col min-w-0">
          <h3 className="font-medium text-lg text-gray-900 line-clamp-1">
            {course.title}
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
            {course.description ||
              "Tidak ada deskripsi singkat untuk mata pelajaran ini."}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end border-t border-gray-50 pt-3 mt-1">
        <span className="text-sm font-medium text-[#3641f5] flex items-center gap-1.5">
          Buka Bank Soal
          <ArrowRight size={12} weight="bold" />
        </span>
      </div>
    </div>
  );
};

export default CourseCard;