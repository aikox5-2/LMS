import { CircleNotch } from "@phosphor-icons/react";
import { useExamWorkspace } from "../../../hooks/useExamWorkspace";
import WorkspaceHeader from "./components/workspace-header";
import QuestionCard from "./components/question-card";
import QuestionNavigation from "./components/question-navigation";
import FinishConfirmation from "./components/finish-confirmation";
import ExitAlert from "./components/exit-alert";
import Modal from "../../../components/modal";

const ExamWorkspace = () => {
  const {
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
  } = useExamWorkspace();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] w-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <CircleNotch size={40} className="text-[#3641f5] animate-spin" />
          <span className="text-gray-500 font-medium text-sm">
            Menyiapkan Lembar Ujian...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] w-full p-4 md:p-6 lg:px-10 py-2 flex flex-col gap-6">
      {/* Top Header Banner */}
      <WorkspaceHeader
        title={exam?.title || "Ujian"}
        course={exam?.course?.title || "Mata Pelajaran"}
        endTime={endTime}
        onTimeUp={handleTimeUp}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-4xl w-full mx-auto gap-2 my-4 relative">
        {saving && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-2xl">
            <CircleNotch size={32} className="text-[#3641f5] animate-spin" />
          </div>
        )}

        {/* Question Area */}
        {questions.length > 0 ? (
          <QuestionCard
            question={questions[currentIndex]}
            selectedAnswer={currentDraftAnswer}
            onSelectAnswer={handleSelectAnswer}
          />
        ) : (
          <div className="bg-white border border-gray-100 rounded-2xl p-10 text-center w-full shadow-sm">
            <p className="text-gray-500 font-medium">
              Ujian ini tidak memiliki pertanyaan.
            </p>
          </div>
        )}

        {/* Navigation Grid Row */}
        {questions.length > 0 && (
          <div className="w-full flex justify-center mt-0 mb-8">
            {/* Navigation Card */}
            <QuestionNavigation
              questions={questions}
              answers={answers}
              currentIndex={currentIndex}
              onSelectQuestion={handleSelectQuestion}
              onSubmit={() => {
                setIsSubmitModalOpen(true);
              }}
            />
          </div>
        )}
      </div>

      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
      >
        <FinishConfirmation
          onClose={() => setIsSubmitModalOpen(false)}
          onConfirm={handleSubmitConfirm}
        />
      </Modal>

      <Modal
        isOpen={isExitModalOpen}
        onClose={() => setIsExitModalOpen(false)}
      >
        <ExitAlert
          onClose={() => setIsExitModalOpen(false)}
          onConfirm={handleExitConfirm}
        />
      </Modal>
    </div>
  );
};

export default ExamWorkspace;