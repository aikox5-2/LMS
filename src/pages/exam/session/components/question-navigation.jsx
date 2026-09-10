import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import Button from "../../../../components/button";

const QuestionNavigation = ({
  questions = [],
  answers = {},
  currentIndex,
  onSelectQuestion,
  onSubmit,
}) => {
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;

  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 shadow-md p-5 w-full max-w-175 mx-auto flex flex-col gap-4"
    >
      {/* Title & Badge */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <h3 className="font-semibold text-gray-800 text-sm">Navigasi Soal</h3>
        <span
          className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-lg border border-blue-100"
        >
          {answeredCount}/{totalQuestions} Soal Terjawab
        </span>
      </div>

      {/* Grid numbers */}
      <div
        className="grid grid-cols-7 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2 md:gap-2.5 lg:gap-3 my-2"
      >
        {questions.map((q, index) => {
          const isCurrent = index === currentIndex;
          const isAnswered = answers[q.id] !== undefined;

          return (
            <button
              key={q.id}
              onClick={() => onSelectQuestion(index)}
              className={`h-8.5 w-8.5 rounded-md border flex items-center justify-center text-xs font-normal transition-all cursor-pointer ${
                isCurrent
                  ? "border-[#3641f5] text-[#3641f5] bg-[#ECF3FF] font-medium"
                  : isAnswered
                  ? "bg-[#3641f5] text-white border-[#3641f5]"
                  : "border-gray-200 bg-white text-[#3641f5] hover:bg-gray-50"
              }`}
            >
              {(index + 1).toString().padStart(2, "0")}
            </button>
          );
        })}
      </div>

      {/* Footer Nav Buttons */}
      <div className="flex items-center gap-2 mt-2 pt-3 border-t border-gray-100 justify-between">
        <Button
          onClick={() => onSelectQuestion(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
          variant="secondary"
          className="min-w-35 justify-center"
        >
          <CaretLeft size={14} />
          Sebelumnya
        </Button>
        <Button
          onClick={() => {
            if (currentIndex === totalQuestions - 1) {
              onSubmit();
            } else {
              onSelectQuestion(currentIndex + 1);
            }
          }}
          variant={
            currentIndex === totalQuestions - 1 ? "primary" : "secondary"
          }
          className="min-w-35 justify-center"
        >
          {currentIndex === totalQuestions - 1 ? "Selesai" : "Berikutnya"}
          {currentIndex !== totalQuestions - 1 && <CaretRight size={14} />}
        </Button>
      </div>
    </div>
  );
};

export default QuestionNavigation;