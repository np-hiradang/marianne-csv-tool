import React, { forwardRef, InputHTMLAttributes } from "react";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: "default" | "outlined" | "filled";
  size?: "sm" | "md" | "lg";
  name?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      variant = "default",
      size = "md",
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "w-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 cursor-pointer";

    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-5 py-3 text-lg",
    };

    const variantClasses = {
      default:
        "border border-gray-300 rounded-md bg-white hover:border-gray-400 focus:border-blue-500",
      outlined:
        "border-2 border-gray-300 rounded-md bg-transparent hover:border-gray-400 focus:border-blue-500",
      filled:
        "border border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100 focus:bg-white focus:border-blue-500",
    };

    const disabledClasses = disabled
      ? "opacity-50 cursor-not-allowed bg-gray-100"
      : "";
    const errorClasses = error
      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
      : "";

    const inputClasses = [
      baseClasses,
      sizeClasses[size],
      variantClasses[variant],
      disabledClasses,
      errorClasses,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            className={inputClasses}
            style={{
              paddingLeft: leftIcon ? "2.5rem" : undefined,
              paddingRight: rightIcon ? "2.5rem" : undefined,
            }}
            disabled={disabled}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>

        {(error || helperText) && (
          <div className="mt-1">
            {error && <p className="text-sm text-red-600">{error}</p>}
            {helperText && !error && (
              <p className="text-sm text-gray-500">{helperText}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
