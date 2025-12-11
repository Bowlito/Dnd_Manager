import type { ButtonHTMLAttributes, ReactNode } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: "primary" | "secondary" | "danger" | "ghost" | "icon";
    isLoading?: boolean;
}

export const Button = ({
    children,
    variant = "primary",
    isLoading,
    className = "",
    type = "button",
    ...props
}: Props) => {
    const baseStyles =
        "font-bold rounded transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";

    const variants = {
        primary:
            "bg-amber-600 hover:bg-amber-500 text-slate-900 py-2 px-6 shadow-lg",
        secondary:
            "bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 border border-slate-600",
        danger: "bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 py-1 px-3",
        ghost: "bg-transparent hover:bg-slate-800 text-slate-400 hover:text-white py-1 px-2",
        icon: "text-slate-400 hover:text-red-500 p-1", // Idéal pour les croix de suppression
    };

    return (
        <button
            type={type}
            className={`${baseStyles} ${variants[variant]} ${className}`}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading ? (
                <>
                    <svg
                        className="animate-spin h-4 w-4 text-current"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                    Chargement...
                </>
            ) : (
                children
            )}
        </button>
    );
};
