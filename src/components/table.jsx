import { useState } from "react";

const Table = ({ columns = [], data = [], renderActions }) => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  const toggleMenu = (e, rowIdx) => {
    if (activeMenu === rowIdx) {
      setActiveMenu(null);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX - 100,
      });
      setActiveMenu(rowIdx);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-[#ECF3FF] border-y border-gray-100">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`px-6 py-3 text-[12px] font-semibold text-[#475467] tracking-wider whitespace-nowrap ${
                    col.className?.includes("text-center")
                      ? "text-center"
                      : col.className?.includes("text-right")
                      ? "text-right"
                      : "text-left"
                  } ${col.className || ""}`}
                >
                  {col.header}
                </th>
              ))}
              {renderActions && <th className="px-6 py-3 w-12.5"></th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.length > 0 ? (
              data.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  {columns.map((col, colIdx) => (
                    <td
                      key={colIdx}
                      className={`px-6 py-4 text-sm text-[#344054] ${col.className || ""}`}
                    >
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}

                  {renderActions && (
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={(e) => toggleMenu(e, rowIdx)}
                        className="p-1 hover:bg-gray-100 cursor-pointer rounded-lg text-gray-400 transition-colors"
                      >
                        <DotsThreeVertical size={24} weight="bold" />
                      </button>

                      {/* Action Dropdown using Portal */}
                      {activeMenu === rowIdx &&
                        createPortal(
                          <>
                            <div
                              className="fixed inset-0 z-9998"
                              onClick={() => setActiveMenu(null)}
                            />
                            <div
                              style={{
                                position: "absolute",
                                top: menuPosition.top,
                                left: menuPosition.left,
                                width: "180px",
                              }}
                              className="z-9999 bg-white border border-gray-100 rounded-xl shadow-xl py-1 text-left animate-in fade-in zoom-in duration-150"
                            >
                              {renderActions(row, () => setActiveMenu(null))}
                            </div>
                          </>,
                          document.body
                        )}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + (renderActions ? 1 : 0)}>
                  <EmptyState />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
