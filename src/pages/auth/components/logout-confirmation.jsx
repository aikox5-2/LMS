import { SignOut } from "@phosphor-icons/react";
import Button from "../../../components/button";

const LogoutConfirmation = ({ onClose, onConfirm, isLoading = false }) => {
  return (
    <div className="flex flex-col">
      <div className="p-8 pb-4 flex flex-col">
        <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center mb-5">
          <SignOut size={28} className="text-[#B01212]" />
        </div>

        <h3 className="text-2xl font-medium text-[#1D2939] mb-2">
          Keluar Aplikasi
        </h3>
        <p className="text-[#475467] leading-relaxed">
          Apakah Anda yakin ingin keluar dari aplikasi ujian online sekolah ini?
        </p>
      </div>

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
          {isLoading ? "Mengeluarkan..." : "Keluar"}
        </Button>
      </div>
    </div>
  );
};

export default LogoutConfirmation;