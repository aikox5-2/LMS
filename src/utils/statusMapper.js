export const formatExamStatus = (status) => {
  if (!status) return "Tersedia";
  const statusLower = status.toLowerCase();

  if (statusLower === "tersedia") return "Tersedia";
  if (statusLower === "selesai") return "Selesai";
  if (statusLower === "terlewat") return "Terlewat";
  if (statusLower === "sedang review" || statusLower === "pending")
    return "Sedang Review";
  if (
    statusLower === "sedang ujian" ||
    statusLower === "berlangsung" ||
    statusLower === "in_progress"
  )
    return "Sedang Ujian";
  if (statusLower === "mendatang") return "Belum Mulai";

  return "Tersedia";
};

export const getBackendStatus = (status) => {
  const map = {
    Tersedia: "tersedia",
    "Belum Mulai": "mendatang",
    "Sedang Ujian": "berlangsung",
    "Sedang Review": "pending",
    Selesai: "selesai",
    Terlewat: "terlewat",
  };
  return map[status] || undefined;
};

export const getExamStatusStyle = (status) => {
  const statusMap = {
    Selesai: { color: "text-[#039855]", dot: "bg-[#039855]" },
    Tersedia: { color: "text-[#3641F5]", dot: "bg-[#3641F5]" },
    Terlewat: { color: "text-[#D92D20]", dot: "bg-[#D92D20]" },
    "Sedang Review": { color: "text-[#DC6803]", dot: "bg-[#DC6803]" },
    "Sedang Ujian": { color: "text-[#DC6803]", dot: "bg-[#DC6803]" },
    "Belum Mulai": { color: "text-[#475467]", dot: "bg-[#98A2B3]" },
  };
  return statusMap[status] || { color: "text-gray-500", dot: "bg-gray-400" };
};