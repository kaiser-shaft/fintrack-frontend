import { InputHTMLAttributes, ReactNode, Ref } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    ref?: Ref<HTMLInputElement>;
}

export const Input = ({
    className = "",
    label,
    error,
    leftIcon,
    rightIcon,
    id,
    ref,
    ...props
}: InputProps) => {
    return (
        <div className="w-full flex flex-col gap-1.5">
            {label && (
                <label
                    htmlFor={id}
                    className="text-xs font-medium text-neutral-400 select-none px-0.5"
                >
                    {label}
                </label>
            )}
            <div className="relative flex items-center">
                {leftIcon && (
                    <div className="absolute left-3.5 text-neutral-500 pointer-events-none flex items-center justify-center">
                        {leftIcon}
                    </div>
                )}
                <input
                    ref={ref}
                    id={id}
                    className={`w-full bg-neutral-950/40 text-neutral-100 placeholder-neutral-500 text-sm border transition-all duration-200 rounded-xl outline-none focus:ring-2 focus:ring-violet-500/20
                                  ${leftIcon ? "pl-11" : "pl-4"}
                                  ${rightIcon ? "pr-11" : "pr-4"}
                                  ${
                                      error
                                          ? "border-red-500/80 focus:border-red-500 focus:ring-red-500/10"
                                          : "border-neutral-800/80 focus:border-violet-500/60 focus:bg-neutral-950/60"
                                  }
                                  py-3.5
                                  ${className}
                              `}
                    {...props}
                />
                {rightIcon && (
                    <div className="absolute right-3.5 text-neutral-500 flex items-center justify-center">
                        {rightIcon}
                    </div>
                )}
            </div>
            {error && (
                <span className="text-xs text-red-500 px-0.5 mt-0.5 animate-fadeIn">
                    {error}
                </span>
            )}
        </div>
    );
};
