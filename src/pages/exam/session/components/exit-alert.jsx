import { SignOut } from "@phosphor-icons/react";
import Button from "../../../../components/button";

const ExitAlert = ({ onConfirm, onClose, isLoading = false }) => {
  return (
    <div className="flex flex-col">
      {/* Header / Content Section */}
      <div className="p-8 pb-4 flex flex-col">
        {/* Icon Container */}
        <div className="w-12 h-12 bg-[#FEF3F2] rounded-lg flex items-center justify-center mb-5">
          <SignOut size={28} className="text-[#B01212]" weight="bold" />
        </div>

        <h3 className="text-2xl font-medium text-[#1D2939] mb-2">
          Keluar dari Ujian?
        </h3>
        <p className="text-[#475467] leading-relaxed">
          Apakah Anda yakin ingin keluar dari halaman ujian ini? Jawaban Anda
          yang sudah tersimpan tidak akan hilang, tapi waktu ujian akan terus
          berjalan.
        </p>
      </div>

      {/* Footer Section */}
      <div className="px-8 pb-8 flex gap-3">
        <Button
          variant="secondary"
          glossy
          className="flex-1 justify-center"
          onClick={onClose}
          disabled={isLoading}
        >
          Batal
        </Button>
        <Button
          variant="destructive"
          className="flex-1 justify-center"
          onClick={onConfirm}
          disabled={isLoading}
        >
          {isLoading ? "Keluar..." : "Ya, Keluar"}
        </Button>
      </div>
    </div>
  );
};

export default ExitAlert;