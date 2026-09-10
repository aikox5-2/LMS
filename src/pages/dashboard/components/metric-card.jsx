const MetricCard = ({ icon: Icon, label, value }) => {
  return (
    <div className="bg-linear-to-b from-[#D7DDFF] to-white border-4 border-[#3641F51A] bg-clip-padding rounded-2xl p-5 flex flex-col gap-4 shadow-sm">
      {/* Icon Wrapper */}
      <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-[#F2F4F7] flex items-center justify-center">
        <Icon size={24} weight="fill" className="text-[#3641F5]" />
      </div>

      {/* Text Info */}
      <div className="flex flex-col gap-1">
        <span className="text-gray-500 text-sm font-medium">{label}</span>
        <span className="text-3xl font-medium text-[#1D2939] font-sans tracking-tight">
          {value}
        </span>
      </div>
    </div>
  );
};

export default MetricCard;