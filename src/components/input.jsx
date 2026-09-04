const Input = ({
  label,
  id,
  type = "text",
  className = "",
  suffix,
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-1 items-start justify-center w-full ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="font-medium text-[#344054] text-[14px] tracking-[-0.28px]"
        >
          {label}
        </label>
      )}
      <div className="bg-white border border-[#e4e7ec] flex h-10 items-center overflow-hidden px-3 py-[7.5px] rounded-[10px] w-full transition-all focus-within:border-[#3641f5]">
        <input
          id={id}
          type={type}
          className="bg-transparent border-none flex-1 font-normal outline-none text-[14px] text-[#344054] placeholder:text-[#98a2b3] tracking-[-0.5px] w-full"
          {...props}
        />
        {suffix && (
          <div className="ml-2 flex items-center justify-center">
            {suffix}
          </div>
        )}
      </div>
    </div>
  );
};

export default Input;


