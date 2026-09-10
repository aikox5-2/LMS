import { TrashSimple } from "@phosphor-icons/react";
import Modal from "../../../../components/modal";
import Button from "../../../../components/button";

const ExamDelete = ({
  isOpen,
  onClose,
  onConfirm,
  examName,
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
      errMsg.includes("attempt_id") ||
      errMsg.includes("answers")
    ) {
      return "Ujian tidak dapat dihapus karena sudah memiliki riwayat pengerjaan/jawaban siswa.";
    }
    return errMsg || "Gagal menghapus ujian. Silakan coba lagi.";
  };

  const friendlyError = getFriendlyErrorMessage(error);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col">
        {/* Header / Content Section */}
        <div className="p-8 pb-4 flex flex-col">
          <div className="w-12 h-12 bg-[#FEF3F2] rounded-lg flex items-center justify-center mb-5">
            <TrashSimple size={28} className="text-[#B01212]" />
          </div>

          <h3 className="text-2xl font-medium text-[#1D2939] mb-2">
            Delete Ujian
          </h3>
          <p className="text-[#475467] leading-relaxed">
            Apakah kamu yakin ingin menghapus ujian{" "}
            <span className="text-[#344054]">{examName}</span>?
          </p>
        </div>

        {/* Error Banner */}
        {friendlyError && (
          <div className="mx-8 mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium leading-relaxed">
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
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Menghapus..." : "Delete"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ExamDelete;