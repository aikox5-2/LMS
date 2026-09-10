import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const ExamStatus = ({ statusData = [] }) => {
  const labels = statusData.map((item) => item.status);
  const percentages = statusData.map((item) => item.percentage);
  const counts = statusData.map((item) => item.count);

  const isEmpty = statusData.length === 0;

  const data = {
    labels: labels,
    datasets: [
      {
        data: percentages,
        backgroundColor: ["#A4BCFD", "#3641F5"],
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
        display: false,
      },
      tooltip: {
        backgroundColor: "#fff",
        titleColor: "#344054",
        bodyColor: "#344054",
        borderColor: "#E4E7EC",
        borderWidth: 1,
        padding: 12,
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-2xl border-2 border-[#EAECF0] flex flex-col gap-6 h-80">
      <h3 className="text-xl font-medium text-[#1D2939]">
        Status Pengerjaan Ujian
      </h3>
      {isEmpty ? (
        <div className="flex-1 flex items-center justify-center">
          <span className="text-gray-400 text-sm font-medium">
            Tidak ada data status pengerjaan
          </span>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-between gap-6 min-h-0">
          <div className="w-1/2 h-full relative flex items-center justify-center">
            <Doughnut data={data} options={options} />
          </div>

          <div className="flex flex-col gap-5 w-1/2">
            {labels.map((label, i) => {
              const value = percentages[i];
              const total = counts[i];
              const color =
                data.datasets[0].backgroundColor[i] || "#CCCCCC";
              return (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className="w-3 h-3 rounded-sm mt-1 shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <div className="flex flex-col">
                    <span className="text-[15px] font-medium text-[#344054] leading-tight">
                      {label}
                    </span>
                    <span className="text-sm font-normal text-[#475467] mt-1">
                      {total} Siswa ({value}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamStatus;