import { useEffect, useState } from "react";
import whiteLogo from "../../../../assets/white-logo.svg";
import { Clock } from "@phosphor-icons/react";

const WorkspaceHeader = ({ title, course, endTime, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!endTime) return;

    const calculateTimeLeft = () => {
      const difference = new Date(endTime).getTime() - new Date().getTime();
      return Math.max(0, Math.floor(difference / 1000));
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(timer);
        onTimeUp?.();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime, onTimeUp]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return [
      hrs.toString().padStart(2, "0"),
      mins.toString().padStart(2, "0"),
      secs.toString().padStart(2, "0"),
    ].join(":");
  };

  return (
    <div
      className="bg-[#3641f5] text-white max-w-4xl w-full mx-auto rounded-2xl px-4 md:px-6 py-3 md:py-4 flex items-center justify-between gap-2 md:gap-4 shadow-md"
    >
      <div className="flex items-center gap-3 md:gap-4 min-w-0">
        {/* Tempat Logo */}
        <img
          src={whiteLogo}
          className="w-10 h-10 md:w-12 md:h-12 object-contain shrink-0"
          alt=""
        />

        <div className="flex flex-col gap-0.5 min-w-0">
          <h1 className="text-base md:text-xl font-bold tracking-tight truncate">
            {title}
          </h1>
          <p className="text-white/80 text-[10px] md:text-sm font-medium truncate">
            {course}
          </p>
        </div>
      </div>
      <div>
        <div
          className="px-2 md:px-4 py-1.5 md:py-2 rounded-lg flex items-center gap-1.5 md:gap-2 shrink-0 bg-white/10 border border-white/10"
        >
          <Clock size={16} className="text-white md:w-5 md:h-5" />
          <span className="text-sm md:text-xl tracking-wider">
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceHeader;