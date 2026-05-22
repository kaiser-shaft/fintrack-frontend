import { ButtonHTMLAttributes, Ref } from "react";

const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500/50 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

const variants = {
    primary:
        "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-[0_4px_20px_rgba(109,40,217,0.25)] hover:shadow-[0_4px_25px_rgba(109,40,217,0.4)]",
    secondary:
        "bg-neutral-900/80 hover:bg-neutral-800/90 text-neutral-100 border border-neutral-800/80 backdrop-blur-sm",
    outline:
        "bg-transparent hover:bg-neutral-900/50 text-neutral-200 border border-neutral-700/60 hover:border-neutral-500",
    ghost: "bg-transparent hover:bg-neutral-900/80 text-neutral-300 hover:text-neutral-100",
};

const sizes = {
    sm: "px-3 py-1.5 text-xs font-semibold rounded-lg",
    md: "px-4 py-2.5 text-sm rounded-xl",
    lg: "px-6 py-3.5 text-base rounded-2xl",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: keyof typeof variants;
    size?: keyof typeof sizes;
    isLoading?: boolean;
    fullWidth?: boolean;
    ref?: Ref<HTMLButtonElement>;
}

export const Button = ({
    children,
    className = "",
    variant = "primary",
    size = "md",
    isLoading = false,
    fullWidth = false,
    disabled,
    ref,
    ...props
}: ButtonProps) => {
    const widthStyle = fullWidth ? "w-full" : "";

    return (
        <button
            ref={ref}
            disabled={disabled || isLoading}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
            {...props}
        >
            {isLoading ? (
                <>
                    <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
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
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                    Загрузка...
                </>
            ) : (
                children
            )}
        </button>
    );
};
