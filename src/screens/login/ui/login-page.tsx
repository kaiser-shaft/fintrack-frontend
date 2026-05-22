import { LoginForm } from "@/features/auth-by-email";

export const LoginPage = () => {
    return (
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden bg-[#0a0a0a]">
            {/* Декоративные размытые фоновые сферы для премиум-дизайна */}
            <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-md z-10 flex flex-col gap-8">
                {/* Элегантный логотип проекта */}
                <div className="flex flex-col items-center gap-2">
                    <div className="h-12 w-12 rounded-2xl bg-linear-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                        <span className="text-white font-bold text-xl tracking-wider">
                            FT
                        </span>
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-neutral-100">
                        FinTrack
                    </h1>
                </div>

                <LoginForm />
            </div>
        </main>
    );
};
