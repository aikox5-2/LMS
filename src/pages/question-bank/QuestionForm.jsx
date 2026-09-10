import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  CaretLeft,
  CircleNotch,
  Plus,
  Trash,
  CheckCircle,
} from "@phosphor-icons/react";
import Button from "../../components/button";
import Input from "../../components/input";
import { toast } from "sonner";
import { useCourseDetail } from "../../hooks/useCourses";
import {
  useQuestionDetail,
  useCreateQuestion,
  useUpdateQuestion,
} from "../../hooks/useQuestions";

const QuestionForm = ({ mode = "create" }) => {
  const { courseId, questionId } = useParams();
  const navigate = useNavigate();
  const isEdit = mode === "edit";

  const [questionText, setQuestionText] = useState("");
  const [type, setType] = useState("multiple_choice");
  const [options, setOptions] = useState([
    { option_text: "", is_correct: true },
    { option_text: "", is_correct: false },
    { option_text: "", is_correct: false },
    { option_text: "", is_correct: false },
  ]);

  const { data: courseDetail } = useCourseDetail(courseId);
  const { data: questionDetail, isLoading: loadingQuestion } = useQuestionDetail(
    questionId,
    isEdit
  );

  const createQuestionMutation = useCreateQuestion();
  const updateQuestionMutation = useUpdateQuestion();

  useEffect(() => {
    if (isEdit && questionDetail) {
      setQuestionText(questionDetail.question_text || "");
      setType(questionDetail.type || "multiple_choice");
      if (
        questionDetail.type === "multiple_choice" &&
        Array.isArray(questionDetail.options) &&
        questionDetail.options.length > 0
      ) {
        setOptions(
          questionDetail.options.map((opt) => ({
            id: opt.id,
            option_text: opt.option_text || "",
            is_correct: !!opt.is_correct,
          }))
        );
      }
    }
  }, [questionDetail, isEdit]);

  const handleBack = () => navigate(`/question-bank/course/${courseId}`);

  const handleOptionTextChange = (index, text) => {
    setOptions((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], option_text: text };
      return next;
    });
  };

  const handleSetCorrectOption = (index) => {
    setOptions((prev) =>
      prev.map((opt, i) => ({
        ...opt,
        is_correct: i === index,
      }))
    );
  };

  const handleAddOption = () => {
    if (options.length >= 6) {
      toast.error("Maksimal 6 pilihan jawaban");
      return;
    }
    setOptions((prev) => [
      ...prev,
      { option_text: "", is_correct: false },
    ]);
  };

  const handleRemoveOption = (index) => {
    if (options.length <= 2) {
      toast.error("Minimal harus ada 2 pilihan jawaban");
      return;
    }
    const wasCorrect = options[index].is_correct;
    const newOptions = options.filter((_, i) => i !== index);
    if (wasCorrect && newOptions.length > 0) {
      newOptions[0].is_correct = true;
    }
    setOptions(newOptions);
  };

  const saving =
    createQuestionMutation.isPending || updateQuestionMutation.isPending;

  const handleSave = async () => {
    if (!questionText.trim()) {
      toast.error("Silakan isi teks pertanyaan");
      return;
    }

    if (type === "multiple_choice") {
      const emptyOption = options.some((opt) => !opt.option_text.trim());
      if (emptyOption) {
        toast.error("Semua pilihan jawaban harus diisi");
        return;
      }

      const hasCorrect = options.some((opt) => opt.is_correct);
      if (!hasCorrect) {
        toast.error("Pilih salah satu jawaban yang benar");
        return;
      }
    }

    const payload = {
      course_id: Number(courseId),
      question_text: questionText,
      type,
      options:
        type === "multiple_choice"
          ? options.map((opt) => ({
              option_text: opt.option_text,
              is_correct: opt.is_correct,
            }))
          : undefined,
    };

    try {
      if (isEdit) {
        await updateQuestionMutation.mutateAsync({
          id: questionId,
          data: payload,
        });
        toast.success("Soal berhasil diperbarui");
      } else {
        await createQuestionMutation.mutateAsync(payload);
        toast.success("Soal berhasil ditambahkan");
      }
      navigate(`/question-bank/course/${courseId}`);
    } catch (error) {
      console.error("Error saving question:", error);
      toast.error(
        error?.response?.data?.message ||
          "Gagal menyimpan soal. Silakan coba lagi."
      );
    }
  };

  return (
    <div className="flex flex-col w-full bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-10 relative">
      {loadingQuestion && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
          <CircleNotch size={32} className="text-[#465FFF] animate-spin" />
        </div>
      )}

      <div className="p-6 lg:p-10 flex flex-col lg:flex-row gap-10 lg:gap-20">
        {/* Left Section - Info */}
        <div className="flex flex-col gap-4 lg:w-1/3">
          <Button
            onClick={handleBack}
            className="w-fit"
            variant="secondary"
            glossy
          >
            <CaretLeft size={16} weight="bold" />
            Kembali
          </Button>
          <div className="mt-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#465FFF]">
              {courseDetail?.title || "Mata Pelajaran"}
            </span>
            <h2 className="text-2xl font-bold text-[#1D2939] mt-1">
              {isEdit ? "Edit Soal" : "Tambah Soal Baru"}
            </h2>
            <p className="text-[#475467] mt-1 leading-relaxed">
              {isEdit
                ? "Perbarui teks soal dan opsi jawaban yang tersedia."
                : "Tuliskan pertanyaan serta kunci jawaban untuk bank soal mata pelajaran ini."}
            </p>
          </div>
        </div>

        {/* Right Section - Form */}
        <div className="flex flex-col gap-6 lg:flex-1 max-w-2xl">
          {/* Tipe Soal */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#344054]">
              Tipe Soal
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType("multiple_choice")}
                className={`flex items-center justify-center py-3 px-4 rounded-xl border font-medium text-sm transition-all ${
                  type === "multiple_choice"
                    ? "border-[#465FFF] bg-[#465FFF]/5 text-[#465FFF]"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                }`}
              >
                Pilihan Ganda
              </button>
              <button
                type="button"
                onClick={() => setType("essay")}
                className={`flex items-center justify-center py-3 px-4 rounded-xl border font-medium text-sm transition-all ${
                  type === "essay"
                    ? "border-[#465FFF] bg-[#465FFF]/5 text-[#465FFF]"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                }`}
              >
                Esai / Uraian
              </button>
            </div>
          </div>

          {/* Teks Pertanyaan */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#344054]">
              Teks Pertanyaan
            </label>
            <textarea
              className="w-full min-h-36 p-4 rounded-xl border border-[#e4e7ec] outline-none focus:border-[#465FFF] text-sm text-[#344054] placeholder:text-[#98a2b3] transition-all resize-none"
              placeholder="Tuliskan pertanyaan soal di sini..."
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
            />
          </div>

          {/* Opsi Pilihan Ganda */}
          {type === "multiple_choice" && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-[#344054]">
                  Pilihan Jawaban (Klik radio untuk kunci jawaban benar)
                </label>
                {options.length < 6 && (
                  <button
                    type="button"
                    onClick={handleAddOption}
                    className="text-xs font-semibold text-[#465FFF] flex items-center gap-1 hover:underline"
                  >
                    <Plus size={14} weight="bold" /> Tambah Pilihan
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-3">
                {options.map((option, idx) => {
                  const letter = String.fromCharCode(65 + idx);
                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${
                        option.is_correct
                          ? "border-emerald-500 bg-emerald-50/40"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => handleSetCorrectOption(idx)}
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                          option.is_correct
                            ? "bg-emerald-500 text-white shadow-sm"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                        title="Jadikan Jawaban Benar"
                      >
                        {letter}
                      </button>

                      <input
                        type="text"
                        value={option.option_text}
                        onChange={(e) =>
                          handleOptionTextChange(idx, e.target.value)
                        }
                        placeholder={`Jawaban pilihan ${letter}...`}
                        className="flex-1 bg-transparent border-0 outline-none text-sm text-[#344054] placeholder:text-gray-400"
                      />

                      {options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveOption(idx)}
                          className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                          title="Hapus Pilihan"
                        >
                          <Trash size={16} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
        <Button
          variant="secondary"
          glossy
          onClick={handleBack}
          disabled={saving}
        >
          Batal
        </Button>
        <Button onClick={handleSave} disabled={saving || loadingQuestion}>
          {saving ? (
            <>
              <CircleNotch size={18} className="animate-spin mr-2" />
              Menyimpan...
            </>
          ) : isEdit ? (
            "Simpan Perubahan"
          ) : (
            "Tambah Soal"
          )}
        </Button>
      </div>
    </div>
  );
};

export default QuestionForm;
