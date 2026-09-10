import React from "react";

const ScoreStats = ({ finalScore, correctCount, wrongCount, pendingCount }) => {
  return (
    <div className="flex flex-col items-start md:items-end gap-6 text-left md:text-right w-full md:w-auto">
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-[#475467]">
          Estimasi Nilai Akhir
        </span>
        <div className="text-[40px] font-bold text-[#3641f5]">
          {finalScore}
          <span className="text-gray-300 text-2xl font-normal ml-1">/100</span>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex flex-col items-center gap-1">
          <div className="w-8 h-8 rounded-lg bg-[#ECFDF3] border border-[#9FE7C7] flex items-center justify-center text-[#027A48] text-sm font-bold">
            {correctCount}
          </div>
          <span className="text-[10px] text-gray-400">Benar</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className="w-8 h-8 rounded-lg bg-[#FEF3F2] border border-[#FECDCA] flex items-center justify-center text-[#B42318] text-sm font-bold">
            {wrongCount}
          </div>
          <span className="text-[10px] text-gray-400">Salah</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className="w-8 h-8 rounded-lg bg-[#FFFAEB] border border-[#FEDF89] flex items-center justify-center text-[#B54708] text-sm font-bold">
            {pendingCount}
          </div>
          <span className="text-[10px] text-gray-400">Pending</span>
        </div>
      </div>
    </div>
  );
};

export default ScoreStats;