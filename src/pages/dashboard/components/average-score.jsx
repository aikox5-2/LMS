import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AverageScoreChart = ({ chartData = [] }) => {
  const safeData = Array.isArray(chartData) ? chartData : [];
  const labels = safeData.map(item => item.course_title || item.exam_title || '');
  const scores = safeData.map(item => item.average_score || 0);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#344054',
        bodyColor: '#344054',
        borderColor: '#E4E7EC',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          title: (tooltipItems) => {
            return tooltipItems[0].label;
          },
          label: (context) => ` ${context.dataset.label}: ${context.parsed.y}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          autoSkip: false,
          color: '#667085',
          font: {
            size: 12,
          },
          maxRotation: 0,
          minRotation: 0,
          callback: function(value) {
            const label = this.getLabelForValue(value);
            if (label && label.length > 15) {
              return label.substring(0, 15) + '...';
            }
            return label;
          },
        },
      },
      y: {
        display: false,
        max: 100,
      },
    },
    elements: {
      bar: {
        borderRadius: 8,
      },
    },
  };

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Nilai',
        data: scores,
        backgroundColor: '#3641F5',
        barThickness: 45,
      },
      {
        label: 'Max',
        data: labels.map(() => 100),
        backgroundColor: '#3641F515',
        barThickness: 45,
        grouped: false,
        order: 1,
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-2xl border-2 border-[#EAECF0] flex flex-col gap-6 h-80">
      <h3 className="text-xl font-medium text-[#1D2939]">Rata-Rata Nilai Ujian</h3>
      <div className="flex-1 w-full overflow-x-auto min-h-0">
        {safeData.length === 0 ? (
          <div className="h-full w-full flex items-center justify-center">
            <span className="text-gray-400 text-sm font-medium">Tidak ada data statistik nilai</span>
          </div>
        ) : (
          <div
            style={{
              minWidth: `${Math.max(safeData.length * 110, 450)}px`,
              height: '100%',
            }}
          >
            <Bar options={options} data={data} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AverageScoreChart;