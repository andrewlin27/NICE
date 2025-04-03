import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger"; // Different styles
}

const Button: React.FC<ButtonProps> = ({ 
  variant = "primary", 
  className = "", 
  children, 
  ...props 
}) => {
  const baseStyles = "px-4 py-2 rounded-md font-medium transition duration-300 ease-in-out hover:scale-105";

  const variantStyles = {
    primary: "bg-[#D25875] text-white hover:bg-[#D4365B]",
    secondary: "bg-[#86D845] text-white hover:bg-[#669E39]",
    danger: "bg-red-500 text-white hover:bg-red-700",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props} // Spread all other props like onClick
    >
      {children}
    </button>
  );
};

export default Button;
