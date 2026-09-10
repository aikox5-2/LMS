import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { examService } from "../../../services/examService";
import Button from "../../../components/button";
import { formatDateTimeWithComma } from "../../../utils/date";
import { CaretLeft, BookOpen, Clock, XCircle } from "@phosphor-icons/react";
import CorrectionCard from "./components/correction-card";
import { isMultipleChoiceQuestion } from "../../../hooks/useExamWorkspace";


const StudentResultDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isTeacherFlow = location.pathname.startsWith("/results");
  const isActiveExamsFlow = location.pathname.startsWith("/active-exams");

  const handleBack = () => {
    if (isTeacherFlow) {
      navigate("/results");
    } else if (isActiveExamsFlow) {
      navigate("/active-exams");
    } else {
      navigate("/history");
    }
  };

  useEffect(() => {
    const fetchExamDetail = async () => {
      try {
        setLoading(true);
        const searchParams = new URLSearchParams(location.search);
        const queryExamId = searchParams.get("exam_id");
        const queryUserId = searchParams.get("user_id");

        let attemptResponse;
        if (isTeacherFlow) {
          attemptResponse = await examService.getTeacherAttemptDetail(
            queryExamId || id,
            queryUserId
          );
        } else {
          attemptResponse = await examService.getMyAttempt(id);
        }

        if (attemptResponse.success) {
          const attemptData = attemptResponse.data;
          sessionStorage.setItem("currentExamTitle", attemptData.exam_title);

          const examData = {
            title: attemptData.exam_title,
            course: attemptData.course_title,
            end_time: attemptData.completion_time,
            attempt: {
              score: attemptData.score,
              status: attemptData.status,
            },
            questions: (attemptData.questions || []).map((q) => {
              const isMultipleChoice = isMultipleChoiceQuestion(q);
              const ans = q.answer || {};

              return {
                id: q.id,
                question_text: q.question_text,
                type: q.type,
                student_answer: {
                  option_text: isMultipleChoice
                    ? ans.selected_option || "Tidak dijawab"
                    : "",
                  answer_text: ans.essay_answer,
                  status:
                    ans.is_correct === null
                      ? "pending"
                      : ans.is_correct
                      ? "benar"
                      : "salah",
                  percentage: ans?.percentage ?? (ans.is_correct ? 100 : 0),
                },
              };
            }),
          };

          setExam(examData);
        } else {
          setError(attemptResponse.message || "Gagal mengambil detail ujian");
        }
      } catch (err) {
        setError(err.message || "Terjadi kesalahan saat memuat detail ujian");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchExamDetail();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-48px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3641f5]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-48px)] p-6 bg-white rounded-2xl border border-[#EAECF0]">
        <XCircle size={48} className="text-red-500 mb-4" />
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Terjadi Kesalahan
        </h2>
        <p className="text-gray-600 text-sm text-center mb-6">{error}</p>
        <Button
          onClick={handleBack}
          variant="secondary"
          glossy
          className="w-fit"
        >
          <CaretLeft size={16} weight="bold" />
          Kembali
        </Button>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-48px)] p-6 bg-white rounded-2xl border border-[#EAECF0]">
        <BookOpen size={48} className="text-gray-400 mb-4" />
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Ujian Tidak Ditemukan
        </h2>
        <p className="text-gray-600 text-sm text-center mb-6">
          Detail ujian tidak dapat ditemukan.
        </p>
        <Button
          onClick={handleBack}
          variant="secondary"
          glossy
          className="w-fit"
        >
          <CaretLeft size={16} weight="bold" />
          Kembali
        </Button>
      </div>
    );
  }

  const questions = exam.questions || [];

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-48px)] bg-transparent">
      {/* White container wrapper */}
      <div className="bg-white rounded-2xl border border-[#EAECF0] overflow-hidden flex flex-col p-6 md:p-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            onClick={handleBack}
            variant="secondary"
            glossy
            className="w-fit"
          >
            <CaretLeft size={16} weight="bold" />
            Kembali
          </Button>
        </div>

        {/* Exam Title & Score Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-[#F2F4F7] gap-4 mb-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-xl md:text-2xl font-semibold text-[#1D2939]">
              {exam.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[#475467] text-sm">
              <span className="flex items-center gap-1.5">
                <BookOpen size={16} className="text-gray-400" />
                {exam.course || "Mata Pelajaran"}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={16} className="text-gray-400" />
                Diselesaikan: {formatDateTimeWithComma(exam?.end_time)}
              </span>
            </div>
          </div>

          {/* Final Score Display without stats */}
          <div className="flex flex-col items-center justify-center whitespace-nowrap self-stretch md:self-auto border-t md:border-t-0 pt-4 md:pt-0 border-gray-100">
            <span className="text-xs font-semibold text-[#475467] uppercase tracking-wider mb-2 text-center w-full">
              Nilai Akhir
            </span>
            {exam.attempt?.score !== null &&
            exam.attempt?.score !== undefined ? (
              <div className="text-4xl font-semibold text-[#3641f5] text-center w-full">
                {exam.attempt.score}
                <span className="text-xl text-[#98A2B3] font-medium">/100</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 w-full">
                <div className="w-10 h-10 rounded-xl bg-[#FFFAEB] border border-[#FEDF89] flex items-center justify-center">
                  <Clock size={20} className="text-[#B54708]" weight="bold" />
                </div>
                <span className="text-sm font-semibold text-[#B54708] text-center w-full">
                  Sedang Ditinjau Guru
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {questions.map((q, idx) => (
            <CorrectionCard
              key={q.id}
              question={q}
              index={idx}
              isActiveExamsFlow={isActiveExamsFlow}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentResultDetail;