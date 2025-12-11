import { forwardRef, type SelectHTMLAttributes } from "react";

// Format standard pour nos options
export interface SelectOption {
    label: string;
    value: string | number;
}

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: SelectOption[];
    placeholder?: string;
    error?: string;
}

export const Select = forwardRef<HTMLSelectElement, Props>(
    ({ label, options, placeholder, error, className = "", ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                        {label}
                    </label>
                )}
                <select
                    ref={ref}
                    className={`w-full bg-slate-800 border text-white rounded p-2 focus:outline-none focus:border-amber-500 transition-colors cursor-pointer appearance-none
            ${error ? "border-red-500" : "border-slate-600"} 
            ${className}`}
                    {...props}
                >
                    {placeholder && <option value="">{placeholder}</option>}
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                {error && (
                    <span className="text-red-500 text-xs mt-1 block">
                        {error}
                    </span>
                )}
            </div>
        );
    }
);
Select.displayName = "Select";
