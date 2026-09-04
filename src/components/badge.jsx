const Badge = ({
  children,
  variant = "primary",
  size = "sm",
  className = "",
}) => {
  const sizeStyles = {
    sm: "px-2.5 py-0.5",
    md: "px-2.5 py-1.5",
  };
  const paddingStyle = sizeStyles[size] || sizeStyles.sm;
  const baseStyle = `${paddingStyle} rounded-sm text-sm font-medium whitespace-nowrap flex items-center justify-center w-fit`;

  const variants = {
    primary: "bg-[#ECF3FF] text-[#3641F5]",
    success: "bg-[#ECFDF3] text-[#027A48]",
    warning: "bg-[#FFFAEB] text-[#DC6803]",
    danger: "bg-[#FEF3F2] text-[#B42318]",
    secondary: "bg-[#F9FAFB] text-[#344054]",
  };

  const variantStyle = variants[variant] || variants.primary;

  return (
    <span className={`${baseStyle} ${variantStyle} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
