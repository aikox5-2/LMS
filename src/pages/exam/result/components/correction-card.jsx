import { Check, XCircle, Clock } from "@phosphor-icons/react";
import { isMultipleChoiceQuestion } from "../../../../hooks/useExamWorkspace";

const CorrectionCard = ({
  question,
  index,
  isActiveExamsFlow = false,
  role = "student",
  currentStatus = null,
  onGrade = null,
  isReadOnly = false,
}) => {
  if (!question) return null;

  const isMultipleChoice =
    question.type === "multiple_choice" ||
    question.type === "Pilihan ganda" ||
    isMultipleChoiceQuestion(question);

  // Ekstrak teks jawaban siswa dari berbagai format props
  let studentAnswerText = "Tidak dijawab";
  if (typeof question.studentAnswer === "string") {
    studentAnswerText = question.studentAnswer;
  } else if (question.student_answer) {
    if (isMultipleChoice) {
      studentAnswerText = question.student_answer.option_text || "Tidak dijawab";
    } else {
      studentAnswerText =
        question.student_answer.answer_text ||
        question.student_answer.essay_answer ||
        "Tidak dijawab";
    }
  } else if (question.answer) {
    if (isMultipleChoice) {
      studentAnswerText = question.answer.selected_option || "Tidak dijawab";
    } else {
      studentAnswerText = question.answer.essay_answer || "Tidak dijawab";
    }
  }

  if (!studentAnswerText || String(studentAnswerText).trim() === "") {
    studentAnswerText = "Tidak dijawab";
  }

  // Tentukan status & persentase nilai
  const activeGrade = currentStatus || {};
  const status =
    activeGrade.status ||
    question.status ||
    (question.student_answer?.status) ||
    "pending";

  const percentage =
    activeGrade.percentage !== undefined
      ? activeGrade.percentage
      : question.percentage !== undefined
      ? question.percentage
      : question.student_answer?.percentage !== undefined
      ? question.student_answer.percentage
      : status === "benar"
      ? 100
      : 0;

  const isTeacher = role === "teacher";

  return (
    <div className="bg-white border border-[#EAECF0] rounded-2xl relative overflow-hidden shadow-sm">
      {/* Side accent border */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1.5 ${
          isActiveExamsFlow ? "bg-[#3641f5]" : "bg-[#eef1f5]"
        }`}
      />

      <div className="px-6 py-5">
        <div className="flex justify-between items-center mb-3">
          <span className="text-gray-500 font-medium text-sm">
            #Soal {index + 1}
          </span>
          <span className="px-3 py-1 bg-[#F5F8FF] text-[#3641f5] text-[12px] font-medium rounded-lg">
            {isMultipleChoice ? "Pilihan ganda" : "Esai"}
          </span>
        </div>

        {/* Question Text */}
        <p className="text-[#344054] font-medium text-base md:text-lg mb-4">
          {question.question_text || question.question}
        </p>

        {/* Question Content based on Type */}
        {isMultipleChoice ? (
          <div
            className={`p-4 rounded-xl border flex justify-between items-center transition-all ${
              status === "benar"
                ? "bg-[#ECFDF3] border-[#039855]"
                : "bg-[#FEF3F2] border-[#D92D20]"
            }`}
          >
            <div className="flex flex-col gap-1">
              <span className="text-xs opacity-70 font-medium text-gray-600">
                Jawaban Siswa (Auto-Graded):
              </span>
              <span className="font-semibold text-gray-900">
                {studentAnswerText}
              </span>
            </div>
            <div
              className={`px-3 py-1.5 rounded-sm flex items-center gap-1.5 text-xs font-bold transition-all border border-transparent ${
                status === "benar"
                  ? "bg-[#C3FFDB] text-[#039855]"
                  : "bg-[#FFC6C2] text-[#D92D20]"
              }`}
            >
              {status === "benar" ? (
                <>
                  <Check size={14} weight="bold" /> Benar
                </>
              ) : (
                <>
                  <XCircle size={14} weight="bold" /> Salah
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="p-4 rounded-xl border bg-gray-50/50 border-gray-100 flex flex-col gap-2 shadow-sm min-h-24">
              <span className="text-xs text-gray-400 font-medium">
                Jawaban Esai Siswa:
              </span>
              <p className="text-[#344054] text-sm leading-relaxed font-normal whitespace-pre-wrap">
                {studentAnswerText}
              </p>
            </div>

            {/* Essay Status & Grading Block */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-1">
              <div className="flex items-center gap-2 text-sm text-[#344054] font-medium">
                <span>Status Penilaian:</span>
                <span
                  className={`px-2.5 py-1 rounded-sm flex items-center gap-1.5 text-xs font-bold transition-all ${
                    status === "benar"
                      ? "bg-[#C3FFDB] text-[#039855]"
                      : status === "salah"
                      ? "bg-[#FFC6C2] text-[#D92D20]"
                      : "bg-[#FFFAEB] text-[#B54708] border border-[#FEDF89]"
                  }`}
                >
                  {status === "benar" ? (
                    <>
                      <Check size={14} weight="bold" /> Benar ({percentage}%)
                    </>
                  ) : status === "salah" ? (
                    <>
                      <XCircle size={14} weight="bold" /> Salah ({percentage}%)
                    </>
                  ) : (
                    <>
                      <Clock size={14} weight="bold" /> Menunggu Koreksi
                    </>
                  )}
                </span>
              </div>

              {/* Teacher Grading Actions */}
              {isTeacher && !isReadOnly && (
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <span className="text-xs text-gray-500 font-medium mr-1">
                    Beri Nilai:
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      onGrade?.(question.id, {
                        status: "benar",
                        percentage: 100,
                      })
                    }
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      status === "benar"
                        ? "bg-[#039855] text-white shadow-sm"
                        : "bg-white border border-gray-200 text-gray-700 hover:border-emerald-500 hover:text-emerald-600"
                    }`}
                  >
                    <Check size={14} weight="bold" /> Benar (100%)
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onGrade?.(question.id, {
                        status: "salah",
                        percentage: 0,
                      })
                    }
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      status === "salah"
                        ? "bg-[#D92D20] text-white shadow-sm"
                        : "bg-white border border-gray-200 text-gray-700 hover:border-red-500 hover:text-red-600"
                    }`}
                  >
                    <XCircle size={14} weight="bold" /> Salah (0%)
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CorrectionCard;
