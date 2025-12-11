import { forwardRef, type InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = forwardRef<HTMLInputElement, Props>(
    ({ label, error, className = "", ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={`w-full bg-slate-900 border text-white rounded p-2 focus:outline-none focus:border-amber-500 transition-colors 
            ${error ? "border-red-500" : "border-slate-600"} 
            ${className}`}
                    {...props}
                />
                {error && (
                    <span className="text-red-500 text-xs mt-1 block">
                        {error}
                    </span>
                )}
            </div>
        );
    }
);
Input.displayName = "Input";
