import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "../../../components/button";
import ScoreStats from "./components/score-stats";
import CorrectionCard from "./components/correction-card";
import { examService } from "../../../services/examService";
import { CaretLeft, CircleNotch, Checks } from "@phosphor-icons/react";
import { toast } from "sonner";

const CorrectionDetail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const examId = searchParams.get("exam_id");
  const userId = searchParams.get("user_id");

  const [studentData, setStudentData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [attemptStatus, setAttemptStatus] = useState("");

  useEffect(() => {
    const fetchAttemptDetail = async () => {
      if (!examId || !userId) {
        setError("Parameter exam_id dan user_id diperlukan.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError("");
        const response = await examService.getAttemptDetailForTeacher(
          examId,
          userId,
        );
        if (response.success && response.data) {
          const raw = response.data;
          setAttemptStatus(raw.status || "");

          const mappedQuestions = (raw.questions || []).map((q) => {
            const ans = q.answer;
            return {
              id: q.id,
              type: q.type === "multiple_choice" ? "Pilihan ganda" : "Esai",
              question: q.question_text,
              studentAnswer:
                q.type === "multiple_choice"
                  ? ans?.selected_option || "Tidak dijawab"
                  : ans?.essay_answer || "Tidak dijawab",
              status: ans
                ? ans.is_correct === null
                  ? "pending"
                  : ans.is_correct
                  ? "benar"
                  : "salah"
                : "salah",
              percentage: ans?.percentage ?? (ans?.is_correct ? 100 : 0),
              isAutoGraded: q.type === "multiple_choice",
              answerId: ans?.id,
            };
          });

          setStudentData({
            name: raw.student_name,
            examTitle: raw.exam_title,
            questions: mappedQuestions,
          });

          const initialAnswers = {};
          mappedQuestions.forEach((q) => {
            initialAnswers[q.id] = {
              status: q.status,
              percentage: q.percentage,
            };
          });
          setAnswers(initialAnswers);
        } else {
          setError(
            response.message || "Gagal memuat detail jawaban siswa."
          );
        }
      } catch (err) {
        console.error("Error fetching attempt detail:", err);
        setError("Terjadi kesalahan saat mengambil detail jawaban siswa.");
      } finally {
        setLoading(false);
      }
    };

    fetchAttemptDetail();
  }, [examId, userId]);

  const handleGrade = (questionId, gradedData) => {
    if (attemptStatus === "in_progress") return;
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { ...prev[questionId], ...gradedData },
    }));
  };

  const handleSaveGrades = async () => {
    if (attemptStatus === "in_progress") {
      toast.warning(
        "Tidak dapat menyimpan nilai karena ujian masih berlangsung."
      );
      return;
    }
    const payload = [];
    if (!studentData) return;

    studentData.questions.forEach((q) => {
      if (!q.isAutoGraded && q.answerId) {
        const currentGrade = answers[q.id];
        if (
          currentGrade?.status === "benar" ||
          currentGrade?.status === "salah"
        ) {
          payload.push({
            id: q.answerId,
            is_correct: currentGrade.status === "benar",
            persentase: currentGrade.percentage,
          });
        }
      }
    });

    if (payload.length === 0) {
      toast.warning("Tidak ada jawaban esai yang dinilai untuk disimpan.");
      return;
    }

    setSaving(true);
    try {
      const response = await examService.correctAnswers({ answers: payload });
      if (response.success) {
        navigate("/results");
      } else {
        toast.error(
          response.message || "Gagal menyimpan hasil koreksi."
        );
      }
    } catch (err) {
      console.error("Error saving corrections:", err);
      toast.error("Terjadi kesalahan saat menyimpan hasil koreksi.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-48px)]">
        <div className="flex flex-col items-center gap-3">
          <CircleNotch size={40} className="text-[#3641f5] animate-spin" />
          <span className="text-gray-500 font-medium text-sm">
            Memuat Detail Jawaban...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-48px)] p-6 bg-white rounded-2xl border border-[#EAECF0] gap-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Terjadi Kesalahan
        </h2>
        <p className="text-gray-600 text-sm text-center max-w-md">{error}</p>
        <Button
          onClick={() => navigate(-1)}
          variant="secondary"
          glossy
        >
          <CaretLeft size={16} weight="bold" />
          Kembali
        </Button>
      </div>
    );
  }

  const totalQuestions = studentData ? studentData.questions.length : 0;
  const correctCount = Object.values(answers).filter(
    (v) => v?.status === "benar"
  ).length;
  const wrongCount = Object.values(answers).filter(
    (v) => v?.status === "salah"
  ).length;
  const pendingCount = Object.values(answers).filter(
    (v) => v?.status === "pending"
  ).length;

  let totalScoreSum = 0;
  if (studentData) {
    studentData.questions.forEach((q) => {
      const currentAns = answers[q.id];
      if (q.isAutoGraded) {
        if (currentAns?.status === "benar") totalScoreSum += 100;
      } else {
        if (currentAns?.percentage !== undefined) {
          totalScoreSum += currentAns.percentage;
        } else if (currentAns?.status === "benar") {
          totalScoreSum += 100;
        }
      }
    });
  }
  const finalScore =
    totalQuestions > 0 ? Math.round(totalScoreSum / totalQuestions) : 0;

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-48px)] bg-transparent relative">
      {saving && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-50 flex items-center justify-center">
          <CircleNotch size={40} className="text-[#3641f5] animate-spin" />
        </div>
      )}
      <div className="bg-white rounded-2xl border border-[#EAECF0] overflow-hidden flex flex-col">
        <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start gap-6">
          {/* Student Info */}
          <div className="flex flex-col gap-4 w-full md:w-auto">
            <Button
              variant="secondary"
              glossy
              className="w-fit"
              onClick={() => navigate(-1)}
            >
              <CaretLeft size={16} weight="bold" />
              Kembali
            </Button>

            <div>
              <h1 className="text-xl md:text-2xl font-semibold text-[#1D2939]">
                Lembar Jawaban Siswa
              </h1>
              <div className="mt-3 flex flex-col gap-2 text-[#475467] text-sm md:text-base">
                <div className="flex flex-col sm:flex-row sm:gap-2">
                  <span className="w-full sm:w-32 text-gray-400 sm:text-gray-500">
                    Nama Siswa
                  </span>
                  <span className="hidden sm:inline">:</span>
                  <span className="font-medium text-[#344054]">
                    {studentData.name}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:gap-2">
                  <span className="w-full sm:w-32 text-gray-400 sm:text-gray-500">
                    Judul Ujian
                  </span>
                  <span className="hidden sm:inline">:</span>
                  <span className="font-medium text-[#344054]">
                    {studentData.examTitle}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Score Summary */}
          <ScoreStats
            finalScore={finalScore}
            correctCount={correctCount}
            wrongCount={wrongCount}
            pendingCount={pendingCount}
          />
        </div>

        <div className="bg-[#E9E9E9] border-t border-b border-[#EAECF0] p-4 md:p-6 flex flex-col gap-6">
          {attemptStatus === "in_progress" && (
            <div className="bg-[#FFFAEB] border border-[#FEDF89] rounded-xl p-4 flex items-start gap-3 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-[#D97706] mt-2 shrink-0 animate-pulse" />
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-[#B54708]">
                  Siswa Sedang Ujian
                </span>
                <span className="text-xs text-[#B54708] leading-relaxed">
                  Siswa ini sedang aktif mengerjakan ujian. Anda dapat meninjau
                  lembar jawaban yang sedang dikerjakan, namun penilaian
                  (grading/correcting) baru dapat diberikan setelah siswa
                  menyelesaikan ujian.
                </span>
              </div>
            </div>
          )}

          {studentData.questions.map((q, idx) => (
            <CorrectionCard
              key={q.id}
              question={q}
              index={idx}
              role="teacher"
              currentStatus={answers[q.id]}
              onGrade={handleGrade}
              isReadOnly={attemptStatus === "in_progress"}
            />
          ))}
        </div>

        {studentData && studentData.questions.some((q) => !q.isAutoGraded) && (
          <div className="sticky bottom-0 bg-white p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 z-20 border-t border-gray-100 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
            <p className="text-sm text-gray-500 italic">
              {attemptStatus === "in_progress"
                ? "Lembar jawaban ini bersifat read-only karena ujian belum selesai dikerjakan."
                : "Pastikan semua soal esai telah dikoreksi sebelum menyimpan nilai akhir."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Button
                variant="secondary"
                glossy
                className="bg-white border-gray-200 text-gray-700 w-full sm:min-w-30"
                onClick={() => navigate(-1)}
              >
                {attemptStatus === "in_progress" ? "Kembali" : "Batal"}
              </Button>
              {attemptStatus !== "in_progress" && (
                <Button
                  variant="primary"
                  className="w-full sm:min-w-50"
                  onClick={handleSaveGrades}
                  disabled={saving}
                >
                  <Checks size={20} weight="bold" />
                  Simpan & Terapkan Nilai
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CorrectionDetail;