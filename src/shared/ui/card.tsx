import { HTMLAttributes, Ref } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    hoverEffect?: boolean;
    ref?: Ref<HTMLDivElement>;
}

export const Card = ({
    children,
    className = "",
    hoverEffect = false,
    ref,
    ...props
}: CardProps) => {
    return (
        <div
            ref={ref}
            className={`backdrop-blur-md bg-neutral-900/30 border border-neutral-800/50 rounded-2xl p-6 md:p-8 shadow-xl transition-all duration-300
                    ${hoverEffect ? "hover:border-neutral-700/50 hover:bg-neutral-900/40 hover:shadow-violet-950/5" : ""}
                    ${className}
                `}
            {...props}
        >
            {children}
        </div>
    );
};

export const CardHeader = ({
    children,
    className = "",
    ...props
}: HTMLAttributes<HTMLDivElement>) => (
    <div className={`mb-6 ${className}`} {...props}>
        {children}
    </div>
);

export const CardTitle = ({
    children,
    className = "",
    ...props
}: HTMLAttributes<HTMLHeadingElement>) => (
    <h3
        className={`text-xl font-semibold text-neutral-100 tracking-tight ${className}`}
        {...props}
    >
        {children}
    </h3>
);

export const CardDescription = ({
    children,
    className = "",
    ...props
}: HTMLAttributes<HTMLParagraphElement>) => (
    <p className={`text-sm text-neutral-400 ${className}`} {...props}>
        {children}
    </p>
);

export const CardContent = ({
    children,
    className = "",
    ...props
}: HTMLAttributes<HTMLDivElement>) => (
    <div className={`${className}`} {...props}>
        {children}
    </div>
);

export const CardFooter = ({
    children,
    className = "",
    ...props
}: HTMLAttributes<HTMLDivElement>) => (
    <div
        className={`mt-6 pt-6 border-t border-neutral-800/30 flex items-center justify-end gap-2 ${className}`}
        {...props}
    >
        {children}
    </div>
);
