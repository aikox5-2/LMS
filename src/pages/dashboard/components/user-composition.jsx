import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const UserComposition = ({ compositionData = [] }) => {
  const roleLabelMap = {
    student: "Student",
    teacher: "Teacher",
    admin: "Admin",
  };

  const labels = compositionData.map(
    (item) => roleLabelMap[item.role] || item.role,
  );
  const percentages = compositionData.map((item) => item.percentage || 0);

  const data = {
    labels: labels,
    datasets: [
      {
        data: percentages,
        backgroundColor: ["#465FFF", "#3641F5", "#1D29CB"],
        hoverOffset: 4,
        borderWidth: 0,
        cutout: "70%",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          usePointStyle: true,
          pointStyle: "rectRounded",
          padding: 20,
          font: {
            size: 14,
          },
          color: "#344054",
        },
      },
      tooltip: {
        backgroundColor: "#fff",
        titleColor: "#344054",
        bodyColor: "#344054",
        borderColor: "#E4E7EC",
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (context) => ` ${context.label}: ${context.parsed}%`,
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-2xl border-2 border-[#EAECF0] flex flex-col gap-6 h-80">
      <h3 className="text-xl font-medium text-[#1D2939]">Komposisi Pengguna</h3>
      <div className="flex-1 w-full relative flex items-center justify-center">
        {compositionData.length === 0 ? (
          <span className="text-gray-400 text-sm font-medium">
            Tidak ada data komposisi
          </span>
        ) : (
          <Doughnut data={data} options={options} />
        )}
      </div>
    </div>
  );
};

export default UserComposition;