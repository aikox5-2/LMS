import { PaperPlaneTilt } from "@phosphor-icons/react";
import Button from "../../../../components/button";

const FinishConfirmation = ({ onClose, onConfirm }) => {
  return (
    <div className="flex flex-col">
      {/* Header / Content Section */}
      <div className="p-8 pb-4 flex flex-col">
        {/* Check Icon Container */}
        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-5">
          <PaperPlaneTilt size={28} className="text-[#3641f5]" />
        </div>

        <h3 className="text-2xl font-medium text-[#1D2939] mb-2">
          Kumpulkan Ujian?
        </h3>
        <p className="text-[#475467] leading-relaxed">
          Apakah Anda yakin ingin menyelesaikan dan mengumpulkan lembar jawaban
          ujian ini? Tindakan ini tidak dapat dibatalkan.
        </p>
      </div>

      {/* Footer Section */}
      <div className="px-8 pb-8 flex gap-3">
        <Button variant="secondary" glossy className="flex-1" onClick={onClose}>
          Batal
        </Button>
        <Button variant="primary" className="flex-1" onClick={onConfirm}>
          Kumpulkan
        </Button>
      </div>
    </div>
  );
};

export default FinishConfirmation;