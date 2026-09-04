const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  disabled = false,
  onClick,
  glossy = false,
  ...props
}) => {
  const baseStyle =
    "relative inline-flex items-center justify-center overflow-hidden rounded-[10px] font-medium transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] whitespace-nowrap";

  const sizes = {
    sm: "h-[32px] px-[12px] text-[12px]",
    md: "h-[40px] px-[16px] text-[14px]",
    lg: "h-[48px] px-[20px] text-[16px]",
  };

  const variants = {
    primary: "text-white shadow-sm",
    secondary: glossy
      ? "text-[#344054] shadow-sm"
      : "bg-white border border-[#e4e7ec] text-[#344054] hover:bg-[#f9fafb] hover:border-[#d0d5dd]",
    outline:
      "bg-transparent border border-[#e4e7ec] text-[#344054] hover:bg-[#f9fafb] hover:border-[#d0d5dd]",
    destructive: "text-white shadow-sm",
    ghost: "bg-transparent text-[#344054] hover:bg-[#f9fafb]",
    ghostDestructive: "bg-transparent text-[#D92D20] hover:bg-[#ffe5e5]",
  };
  const isPrimary = variant === "primary";
  const isDestructive = variant === "destructive";
  const isSecondaryGlossy = variant === "secondary" && glossy;
  return (
    <button
      type={type}
      className={`${baseStyle} ${sizes[size] || ""} ${variants[variant] || ""} ${className} group cursor-pointer`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {isPrimary && (
        <>
          <div className="absolute inset-0 bg-linear-to-b from-[#424cff] to-[#3641f5]" />
          <div className="absolute -inset-px rounded-[10px] border border-[#6a72fb] pointer-events-none shadow-[inset_0px_0px_2px_0px_#fcfcfc,inset_0px_-1px_1px_1px_#192096]" />
        </>
      )}

      {isDestructive && (
        <>
          <div className="absolute inset-0 bg-linear-to-b from-[#F22F33] to-[#DE1B1F]" />
          <div className="absolute -inset-px rounded-[10px] border border-[#DE1B1F] pointer-events-none shadow-[inset_0px_0px_2px_0px_#FCFCFC,inset_0px_-1px_1px_1px_#8E0000]" />
        </>
      )}

      {isSecondaryGlossy && (
        <>
          <div className="absolute inset-0 bg-linear-to-b from-[#FAFAFA] to-[#FFFFFF]" />
          <div className="absolute inset-0 rounded-[10px] pointer-events-none shadow-[inset_0px_-1px_1px_0px_#C2C2C2,inset_0px_1px_1px_0px_#FFFFFF]" />
          <div className="absolute inset-0 rounded-[10px] border border-[#DEDEDE] pointer-events-none z-10" />
        </>
      )}

     {/* Button Content */}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
};

export default Button;
