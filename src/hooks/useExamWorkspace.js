import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { examService } from "../services/examService";

export const isMultipleChoiceQuestion = (question) =>
  question?.type === "multiple_choice" || question?.type === "Pilihan Ganda";

const normalizeSelectedOption = (question, answerValue) => {
  if (!question?.options || !answerValue) return undefined;

  const cleanText = String(answerValue).replace(/^[A-Z]\.\s*/, "").trim();
  const foundOption = question.options.find(
    (option) => String(option.option_text || option.text).trim() === String(cleanText)
  );

  return foundOption?.id;
};

export const useExamWorkspace = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [currentDraftAnswer, setCurrentDraftAnswer] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const hasAlerted = useRef(false);

  const saveCurrentEssayDraftIfNeeded = useCallback(() => {
    if (questions.length === 0 || !questions[currentIndex]) return;

    const activeQuestion = questions[currentIndex];
    if (isMultipleChoiceQuestion(activeQuestion)) return;

    const prevAnswer = answers[activeQuestion.id] || "";
    if (prevAnswer === currentDraftAnswer) {
      return;
    }

    const draftToSave = currentDraftAnswer;
    const questionId = activeQuestion.id;

    setAnswers((prev) => ({
      ...prev,
      [questionId]: draftToSave,
    }));

    examService
      .submitAnswer(id, {
        question_id: Number(questionId),
        selected_option_id: null,
        essay_answer: draftToSave.toString(),
      })
      .catch((error) => console.error("Error saving essay answer:", error));
  }, [answers, currentDraftAnswer, currentIndex, id, questions]);

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);

    const handlePopState = (event) => {
      event.preventDefault();
      setIsExitModalOpen(true);
      window.history.pushState(null, "", window.location.href);
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    const initWorkspace = async () => {
      setLoading(true);

      try {
        const detailResponse = await examService.getExamDetail(id);
        if (!detailResponse.success) {
          console.error("Gagal memuat detail ujian");
          return;
        }

        const examData = detailResponse.data;
        setExam(examData);

        let attemptData = null;
        try {
          const attemptResponse = await examService.getMyAttempt(id);
          if (attemptResponse.success) {
            attemptData = attemptResponse.data;
          }
        } catch (error) {
          console.log("Attempt tidak ditemukan.");
        }

        if (!attemptData) {
          if (!hasAlerted.current) {
            hasAlerted.current = true;
            toast.warning(
              "Anda belum memulai ujian ini. Silakan klik 'Mulai Ujian' pada halaman daftar ujian."
            );
            navigate("/active-exams");
          }
          return;
        }

        const initialAnswers = {};
        (examData.questions || []).forEach((question) => {
          const matchedAnswer = attemptData.answers?.find(
            (answer) => String(answer.question_id) === String(question.id)
          );

          if (matchedAnswer) {
            if (isMultipleChoiceQuestion(question)) {
              if (matchedAnswer.selected_option_id) {
                initialAnswers[question.id] = Number(matchedAnswer.selected_option_id);
              } else if (matchedAnswer.selected_option) {
                const foundOptionId = normalizeSelectedOption(
                  question,
                  matchedAnswer.selected_option
                );
                if (foundOptionId) {
                  initialAnswers[question.id] = foundOptionId;
                }
              }
            } else {
              initialAnswers[question.id] = matchedAnswer.essay_answer || "";
            }
            return;
          }

          const matchedQuestion = attemptData.questions?.find(
            (attemptQuestion) => String(attemptQuestion.id) === String(question.id)
          );
          const previousAnswer = matchedQuestion?.answer;

          if (!previousAnswer) return;

          if (isMultipleChoiceQuestion(question)) {
            if (previousAnswer.selected_option_id) {
              initialAnswers[question.id] = Number(previousAnswer.selected_option_id);
            } else if (previousAnswer.selected_option) {
              const foundOptionId = normalizeSelectedOption(
                question,
                previousAnswer.selected_option
              );
              if (foundOptionId) {
                initialAnswers[question.id] = foundOptionId;
              }
            }
          } else {
            initialAnswers[question.id] = previousAnswer.essay_answer || "";
          }
        });

        setQuestions(examData.questions || []);
        setAnswers(initialAnswers);

        if (attemptData.status === "in_progress") {
          const attemptInfo = examData.attempt || attemptData;
          const end = attemptInfo.end_time
            ? new Date(attemptInfo.end_time)
            : new Date(
                new Date(attemptInfo.start_time || examData.start_time).getTime() +
                  examData.duration * 60 * 1000
              );

          setEndTime(end.toISOString());
        } else {
          if (!hasAlerted.current) {
            hasAlerted.current = true;
            toast.warning("Ujian ini sudah selesai dikerjakan.");
            navigate("/active-exams");
          }
        }
      } catch (error) {
        console.error("Error initializing workspace:", error);
      } finally {
        setLoading(false);
      }
    };

    initWorkspace();
  }, [id, navigate]);

  useEffect(() => {
    if (questions.length > 0 && questions[currentIndex]) {
      const activeQuestionId = questions[currentIndex].id;
      setCurrentDraftAnswer(answers[activeQuestionId] || "");
    }
  }, [answers, currentIndex, questions]);

  useEffect(() => {
    if (questions.length === 0 || !questions[currentIndex]) return;

    const activeQuestion = questions[currentIndex];
    if (isMultipleChoiceQuestion(activeQuestion)) return;

    const prevAnswer = answers[activeQuestion.id] || "";
    if (prevAnswer === currentDraftAnswer) return;

    const timer = setTimeout(async () => {
      try {
        const response = await examService.submitAnswer(id, {
          question_id: Number(activeQuestion.id),
          selected_option_id: null,
          essay_answer: currentDraftAnswer.toString(),
        });

        if (response.success) {
          setAnswers((prev) => ({
            ...prev,
            [activeQuestion.id]: currentDraftAnswer,
          }));
        }
      } catch (error) {
        console.error("Error saving essay answer:", error);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [answers, currentDraftAnswer, currentIndex, id, questions]);

  const handleSelectAnswer = useCallback(
    async (value) => {
      setCurrentDraftAnswer(value);

      const activeQuestion = questions[currentIndex];
      if (!activeQuestion || !isMultipleChoiceQuestion(activeQuestion)) {
        return;
      }

      setAnswers((prev) => ({
        ...prev,
        [activeQuestion.id]: value,
      }));

      try {
        await examService.submitAnswer(id, {
          question_id: Number(activeQuestion.id),
          selected_option_id: Number(value),
          essay_answer: null,
        });
      } catch (error) {
        console.error("Error saving answer:", error);
      }
    },
    [currentIndex, id, questions]
  );

  const handleSelectQuestion = useCallback(
    (index) => {
      saveCurrentEssayDraftIfNeeded();
      setCurrentIndex(index);
    },
    [saveCurrentEssayDraftIfNeeded]
  );

  const handleSubmitConfirm = useCallback(async () => {
    saveCurrentEssayDraftIfNeeded();
    setIsSubmitModalOpen(false);
    setSaving(true);

    try {
      await examService.submitExam(id);
      navigate(`/active-exams/detail/${id}`);
    } catch (error) {
      console.error("Error submitting exam:", error);
      toast.error("Gagal mengumpulkan ujian. Silakan coba lagi.");
    } finally {
      setSaving(false);
    }
  }, [id, navigate, saveCurrentEssayDraftIfNeeded]);

  const handleExitConfirm = useCallback(() => {
    saveCurrentEssayDraftIfNeeded();
    setIsExitModalOpen(false);
    navigate("/active-exams");
  }, [navigate, saveCurrentEssayDraftIfNeeded]);

  const handleTimeUp = useCallback(async () => {
    saveCurrentEssayDraftIfNeeded();
    toast.warning(
      "Waktu ujian Anda telah habis! Ujian akan otomatis dikumpulkan."
    );

    try {
      await examService.submitExam(id);
      navigate(`/active-exams/detail/${id}`);
    } catch (error) {
      console.error("Error auto-submitting exam:", error);
      navigate(`/active-exams/detail/${id}`);
    }
  }, [id, navigate, saveCurrentEssayDraftIfNeeded]);

  return {
    exam,
    questions,
    currentIndex,
    answers,
    currentDraftAnswer,
    endTime,
    loading,
    saving,
    isSubmitModalOpen,
    isExitModalOpen,
    setIsSubmitModalOpen,
    setIsExitModalOpen,
    handleSelectAnswer,
    handleSelectQuestion,
    handleSubmitConfirm,
    handleExitConfirm,
    handleTimeUp,
  };
};