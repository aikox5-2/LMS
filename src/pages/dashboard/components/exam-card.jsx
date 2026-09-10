import { CircleNotch } from '@phosphor-icons/react';
import Button from "../../../components/button";

const ExamCard = ({ subject, duration, title, description, status, onStart, loading }) => {
  const isOngoing = status === 'Sedang Ujian';

  return (
    <div className="bg-white shadow-sm relative overflow-hidden">
      {/* Blue side accent */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#465FFF]" />

      <div className="p-6">
        {/* Header Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-1 bg-[#F0F2FF] text-[#465FFF] text-[12px] font-medium rounded-lg">
            {subject}
          </span>
          <span className="px-3 py-1 bg-[#F0F2FF] text-[#465FFF] text-[12px] font-medium rounded-lg">
            {duration}
          </span>
        </div>

        {/* Content */}
        <div className="mb-6">
          <h3 className="text-[#1D2939] font-medium text-lg mb-1 leading-tight">
            {title}
          </h3>
          <p className="text-[#667085] text-sm font-normal">{description}</p>
        </div>

        {/* Action Button */}
        <Button
          onClick={onStart}
          variant="primary"
          className="w-full"
          disabled={loading}
        >
          {loading ? (
            <>
              <CircleNotch size={18} className="animate-spin" />
              <span>Memulai...</span>
            </>
          ) : (
            isOngoing ? "Lanjutkan Ujian" : "Mulai Ujian"
          )}
        </Button>
      </div>
    </div>
  );
};

export default ExamCard;