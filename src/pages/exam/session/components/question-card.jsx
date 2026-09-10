import { isMultipleChoiceQuestion } from "../../../../hooks/useExamWorkspace";

const QuestionCard = ({ question, selectedAnswer, onSelectAnswer }) => {
  if (!question) return null;

  const isMultipleChoice = isMultipleChoiceQuestion(question);

  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto mt-6 mb-2">
      <div className="flex flex-col gap-3 px-4 w-full">
        <span className="text-sm font-bold text-gray-400 uppercase tracking-wider text-center">
          Pertanyaan
        </span>
        <h2 className="text-xl md:text-2xl font-medium text-[#1D2939] leading-relaxed text-center">
          {question.question_text}
        </h2>
      </div>

      <div className="w-full">
        {isMultipleChoice ? (
          <div className="flex flex-col gap-3.5 w-full">
            {(question.options || []).map((opt, index) => {
              const label = String.fromCharCode(65 + index);
              const isSelected =
                selectedAnswer === opt.id ||
                selectedAnswer === opt.id?.toString();
              return (
                <button
                  key={opt.id || index}
                  onClick={() => onSelectAnswer(opt.id)}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "border-[#3641f5] bg-[#ECF3FF] shadow-sm"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                      isSelected
                        ? "border-[#3641f5] bg-[#3641f5]"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {isSelected && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  <span className="text-[15px] font-medium text-gray-700">
                    <span className="font-semibold">{label}.</span>{" "}
                    {opt.option_text || opt.text}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="w-full flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-500">
              Tulis Jawaban Anda:
            </label>
            <textarea
              rows={6}
              value={selectedAnswer || ""}
              onChange={(e) => onSelectAnswer(e.target.value)}
              placeholder="Ketikkan jawaban esai Anda di sini..."
              className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#3641f5]/20 focus:border-[#3641f5] transition-all text-[15px] font-medium placeholder:text-gray-400 placeholder:font-normal resize-none bg-white"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;