import { useState } from "react";
import Button from "./button";
import { FunnelIcon as Funnel } from "@phosphor-icons/react";
import { createPortal } from "react-dom";

const FilterDropdown = ({ options, selectedValue, onSelect, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const toggleDropdown = (e) => {
    e.stopPropagation();
    if (isOpen) {
      setIsOpen(false);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.right + window.scrollX - 192,
      });
      setIsOpen(true);
    }
  };

  const handleSelect = (value) => {
    onSelect(value);
    setIsOpen(false);
  };

  return (
    <div className={className}>
      <Button variant="secondary" onClick={toggleDropdown} glossy>
        <Funnel size={18} className="mr-2" />
        Filter
      </Button>

      {isOpen &&
        createPortal(
          <>
            <div
              className="fixed inset-0 z-9998"
              onClick={() => setIsOpen(false)}
            />
            <div
              style={{
                position: "absolute",
                top: position.top,
                left: position.left,
                width: "192px",
              }}
              className="z-9999 bg-white border border-gray-200 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] py-1.5 overflow-hidden animate-in fade-in zoom-in duration-150"
            >
              {options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-[#F9FAFB] transition-colors font-medium cursor-pointer ${
                    selectedValue === opt.value
                      ? "text-[#3641f5] bg-[#F9FAFB]"
                      : "text-gray-700"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </>,
          document.body
        )}
    </div>
  );
};

export default FilterDropdown;
