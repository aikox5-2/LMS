import { useState, useEffect, useMemo } from "react";
import { CaretLeft, CircleNotch, Check } from "@phosphor-icons/react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../../components/button";
import Input from "../../../components/input";
import {
  useExamDetail,
  useExamQuestions,
  useAssignExamQuestions,
} from "../../../hooks/useExam";
import { useQuestionsByCourse } from "../../../hooks/useQuestions";
import { toast } from "sonner";

const QuestionManagement = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);
  const [search, setSearch] = useState("");

  const handleBack = () => navigate("/exams");

  const { data: exam, isLoading: examLoading } = useExamDetail(id);
  const { data: assignedQuestions = [], isLoading: questionsLoading } =
    useExamQuestions(id);
  const { data: allQuestionsData, isLoading: allQuestionsLoading } =
    useQuestionsByCourse(exam?.course_id, { limit: 100 });

  const assignMutation = useAssignExamQuestions();

  const allQuestions =
    allQuestionsData?.questions ||
    allQuestionsData?.data ||
    (Array.isArray(allQuestionsData) ? allQuestionsData : []);
  const loading = examLoading || questionsLoading || allQuestionsLoading;
  const saving = assignMutation.isPending;

  useEffect(() => {
    if (assignedQuestions.length > 0) {
      setSelectedQuestionIds(assignedQuestions.map((q) => q.id));
    }
  }, [assignedQuestions]);

  const mappedQuestions = useMemo(() => {
    return allQuestions.map((q) => ({
      id: q.id,
      text: q.question_text || q.question,
      type:
        q.type === "multiple_choice"
          ? "Pilihan Ganda"
          : "Esai",
      selected: selectedQuestionIds.includes(q.id),
    }));
  }, [allQuestions, selectedQuestionIds]);

  const filteredQuestions = useMemo(() => {
    return mappedQuestions.filter((q) =>
      q.text.toLowerCase().includes(search.toLowerCase())
    );
  }, [mappedQuestions, search]);

  const selectedCount = selectedQuestionIds.length;
  const isAllSelected =
    filteredQuestions.length > 0 && filteredQuestions.every((q) => q.selected);

  const toggleQuestion = (questionId) => {
    setSelectedQuestionIds((prev) =>
      prev.includes(questionId)
        ? prev.filter((qId) => qId !== questionId)
        : [...prev, questionId]
    );
  };

  const toggleSelectAll = () => {
    const filteredIds = filteredQuestions.map((q) => q.id);
    if (isAllSelected) {
      setSelectedQuestionIds((prev) =>
        prev.filter((qId) => !filteredIds.includes(qId))
      );
    } else {
      setSelectedQuestionIds((prev) => [...new Set([...prev, ...filteredIds])]);
    }
  };

  const handleSave = async () => {
    try {
      await assignMutation.mutateAsync({
        examId: id,
        questionIds: selectedQuestionIds,
      });
      navigate("/exams");
    } catch (error) {
      console.error("Error saving exam questions:", error);
      toast.error("Gagal menyimpan soal ujian");
    }
  };

  return (
    <div className="flex flex-col w-full bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-10 relative">
      {loading && (
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
            disabled={saving}
          >
            <CaretLeft size={16} weight="bold" />
            Kembali
          </Button>
          <div className="mt-2">
            <h2 className="text-2xl font-medium text-[#1D2939]">Kelola Soal</h2>
            <p className="text-[#475467] mt-1 leading-relaxed">
              Pilih soal dari Bank Soal yang akan diujikan pada{" "}
              <span className="font-normal text-gray-900">
                {exam?.title || "Ujian"}
              </span>
            </p>
          </div>
        </div>

        {/* Right Section - Selection */}
        <div className="flex flex-col gap-6 lg:flex-1 max-w-2xl">
          <div className="w-full">
            <Input
              label="Cari Soal"
              placeholder="Cari soal berdasarkan pertanyaan..."
              className="w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between pb-2">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div
                onClick={toggleSelectAll}
                className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                  isAllSelected
                    ? "bg-[#3641f5] border-[#3641f5]"
                    : "border-gray-300"
                }`}
              >
                {isAllSelected && (
                  <Check size={14} weight="bold" className="text-white" />
                )}
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-black">
                Pilih Semua Soal
              </span>
            </label>
            <span className="text-sm font-medium text-blue-700">
              {selectedCount} Soal Dipilih
            </span>
          </div>

          <div className="flex flex-col gap-2.5 overflow-y-auto max-h-82 bg-[#F6F7F8] p-3 rounded-xl custom-scrollbar">
            {filteredQuestions.map((q) => (
              <div
                key={q.id}
                onClick={() => toggleQuestion(q.id)}
                className={`px-4 py-3.5 rounded-xl transition-all cursor-pointer flex gap-3.5 ${
                  q.selected
                    ? "bg-white ring-1 ring-inset ring-[#3641f5] border border-[#3641f5]"
                    : "bg-white ring-1 ring-inset ring-transparent border border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="mt-0.5">
                  <div
                    className={`w-4.5 h-4.5 rounded border flex items-center justify-center transition-all ${
                      q.selected
                        ? "bg-[#3641f5] border-[#3641f5]"
                        : "border-gray-300"
                    }`}
                  >
                    {q.selected && (
                      <Check size={12} weight="bold" className="text-white" />
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-[15px] font-medium text-[#101828] leading-snug">
                    {q.text}
                  </span>
                  <span className="text-[13px] text-[#98A2B3] font-medium leading-none">
                    {q.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex justify-end gap-3">
        <Button
          variant="secondary"
          glossy
          onClick={handleBack}
          disabled={saving}
        >
          Batal
        </Button>
        <Button onClick={handleSave} disabled={saving || loading}>
          {saving ? (
            <>
              <CircleNotch size={18} className="animate-spin mr-2" />
              Menyimpan...
            </>
          ) : (
            "Simpan Soal"
          )}
        </Button>
      </div>
    </div>
  );
};

export default QuestionManagement;