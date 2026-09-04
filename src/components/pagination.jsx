import { CaretLeft, CaretRight } from "@phosphor-icons/react";

const Pagination = ({
  currentPage = 1,
  totalPages = 10,
  onPageChange,
  limit = 10,
  onLimitChange,
  itemsPerPage,
  onItemsPerPageChange,
}) => {
  const currentLimit = itemsPerPage !== undefined ? itemsPerPage : limit;

  const handleLimitChange = (newLimit) => {
    if (onItemsPerPageChange) {
      onItemsPerPageChange(newLimit);
    }
    if (onLimitChange) {
      onLimitChange(newLimit);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        end = 4;
      } else if (currentPage >= totalPages - 2) {
        start = totalPages - 3;
      }

      if (start > 2) {
        pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-between px-4 md:px-6 py-4 border-t border-gray-100 bg-white rounded-b-2xl">
      {/* desktop rows per page */}
      <div className="hidden md:flex items-center gap-3">
        <span className="text-sm text-gray-500 font-medium">Rows per page</span>
        <div className="relative">
          <select
            value={currentLimit}
            onChange={(e) => handleLimitChange(Number(e.target.value))}
            className="h-9 pl-3 pr-8 flex items-center justify-between gap-2 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-700 font-medium min-w-16 cursor-pointer appearance-none focus:outline-none focus-within:border-[#3641f5] transition-all"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
            <CaretLeft size={14} className="-rotate-90" />
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="flex md:hidden items-center justify-between w-full gap-2">
        {/* Left Side: Rows per page */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-gray-500 font-medium">Rows:</span>
          <div className="relative">
            <select
              value={currentLimit}
              onChange={(e) => handleLimitChange(Number(e.target.value))}
              className="h-8 pl-2 pr-5 flex items-center justify-between border border-gray-200 rounded-lg bg-gray-50 text-xs text-gray-600 font-medium cursor-pointer appearance-none focus:outline-none focus-within:border-[#3641f5] transition-all"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-gray-400">
              <CaretLeft size={10} className="-rotate-90" />
            </div>
          </div>
        </div>

        {/* Right Side: Navigation buttons & page count */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange?.(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-8 h-8 cursor-pointer flex items-center justify-center border border-gray-200 rounded-lg text-gray-600 disabled:opacity-30 disabled:bg-gray-50 transition-all active:scale-95"
          >
            <CaretLeft size={16} weight="bold" />
          </button>

          <span className="text-xs font-semibold text-[#344054]">
            {currentPage} / {totalPages}
          </span>

          <button
            onClick={() => onPageChange?.(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-8 h-8 cursor-pointer flex items-center justify-center border border-gray-200 rounded-lg text-gray-600 disabled:opacity-30 disabled:bg-gray-50 transition-all active:scale-95"
          >
            <CaretRight size={16} weight="bold" />
          </button>
        </div>
      </div>

      {/* desktop navigation */}
      <div className="hidden md:flex items-center gap-1">
        <button
          onClick={() => onPageChange?.(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-black disabled:opacity-30 disabled:hover:text-gray-600 transition-colors"
        >
          Previous
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1 mx-2">
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              disabled={page === "..."}
              onClick={() => typeof page === "number" && onPageChange?.(page)}
              className={`w-9 h-9 flex cursor-pointer items-center justify-center rounded-lg text-sm font-medium transition-all ${
                page === currentPage
                  ? "bg-[#F0F2FF] text-[#465FFF]"
                  : page === "..."
                  ? "text-gray-400 cursor-default"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={() => onPageChange?.(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-black disabled:opacity-30 disabled:hover:text-gray-600 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
