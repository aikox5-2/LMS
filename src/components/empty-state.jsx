import { FolderOpen } from "@phosphor-icons/react";

const EmptyState = ({ message = "Tidak ada data ditemukan" }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="bg-[#F8F9FC] p-4 rounded-full mb-4">
        <FolderOpen size={32} className="text-[#3641f5]" weight="duotone" />
      </div>
      <h3 className="text-sm font-semibold text-gray-900 mb-1">
        Data Kosong
      </h3>
      <p className="text-sm text-gray-500 max-w-sm">
        {message}
      </p>
    </div>
  );
};

export default EmptyState;
