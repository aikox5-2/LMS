import { TrashSimple } from "@phosphor-icons/react";
import Button from "../../components/button";

const CourseDelete = ({
  course,
  onClose,
  onDelete,
  isLoading = false,
  error = null,
}) => {
  const getFriendlyErrorMessage = (err) => {
    if (!err) return null;
    const errMsg =
      typeof err === "string"
        ? err
        : err.response?.data?.errors ||
          err.response?.data?.message ||
          err.message ||
          "";

    if (
      errMsg.includes("foreign key constraint fails") ||
      errMsg.includes("exams") ||
      errMsg.includes("students") ||
      errMsg.includes("attempts") ||
      errMsg.includes("answers")
    ) {
      return "Kursus tidak dapat dihapus karena memiliki keterkaitan data (seperti memiliki data ujian aktif atau siswa terdaftar).";
    }
    return errMsg || "Gagal menghapus kursus. Silakan coba lagi.";
  };

  const friendlyError = getFriendlyErrorMessage(error);

  return (
    <div className="flex flex-col">
      {/* Header / Content Section */}
      <div className="p-8 pb-4 flex flex-col">
        {/* Trash Icon Container */}
        <div className="w-12 h-12 bg-[#FEF3F2] rounded-lg flex items-center justify-center mb-5">
          <TrashSimple size={28} className="text-[#B01212]" />
        </div>

        <h3 className="text-2xl font-medium text-[#1D2939] mb-2">
          Delete Kursus
        </h3>
        <p className="text-[#475467] leading-relaxed">
          Apakah kamu yakin ingin menghapus kursus{" "}
          <span className="font-medium text-[#344054]">{course?.title}</span>?
        </p>
      </div>

      {/* Error Banner */}
      {friendlyError && (
        <div className="mx-8 mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm text-center font-medium leading-relaxed">
          {friendlyError}
        </div>
      )}

      {/* Footer Section */}
      <div className="px-8 pb-8 flex gap-3">
        <Button
          variant="secondary"
          glossy
          className="flex-1"
          onClick={onClose}
          disabled={isLoading}
        >
          Batal
        </Button>
        <Button
          variant="destructive"
          className="flex-1"
          onClick={() => onDelete(course)}
          disabled={isLoading}
        >
          {isLoading ? "Menghapus..." : "Delete"}
        </Button>
      </div>
    </div>
  );
};

export default CourseDelete;