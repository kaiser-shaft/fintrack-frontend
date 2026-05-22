"use client";

import { useAccounts, AccountCard } from "@/entities/account";
import { Button } from "@/shared/ui";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Plus, Wallet, Coins } from "lucide-react";

export const DashboardPage = () => {
    const { data: accounts, isLoading, error } = useAccounts();
    const router = useRouter();

    // Перенаправление на страницу входа при 401 Unauthorized
    useEffect(() => {
        if (error && error.message.toLowerCase().includes("unauthorized")) {
            router.push("/login");
        }
    }, [error, router]);

    // Вычисляем суммарный баланс во всех валютах
    const totalBalances = useMemo(() => {
        if (!accounts) return {};
        return accounts.reduce(
            (acc, account) => {
                const currency = account.currency || "USD";
                acc[currency] = (acc[currency] || 0) + account.balance;
                return acc;
            },
            {} as Record<string, number>,
        );
    }, [accounts]);

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            router.push("/login");
            router.refresh();
        } catch (e) {
            console.error("Ошибка при выходе из системы", e);
        }
    };

    if (isLoading) {
        return (
            <div className="flex-1 flex flex-col bg-[#0a0a0a]">
                <header className="border-b border-neutral-900 bg-neutral-950/20 backdrop-blur-md px-6 py-4 flex items-center justify-between">
                    <div className="h-6 w-24 bg-neutral-800 rounded-lg animate-pulse" />
                    <div className="h-9 w-20 bg-neutral-800 rounded-lg animate-pulse" />
                </header>
                <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12 flex flex-col gap-10">
                    <div className="h-32 w-full bg-neutral-900/30 border border-neutral-950 rounded-2xl animate-pulse" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="h-44 bg-neutral-900/30 border border-neutral-950 rounded-2xl animate-pulse"
                            />
                        ))}
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col bg-[#0a0a0a]">
            {/* Header */}
            <header className="border-b border-neutral-900 bg-neutral-950/20 backdrop-blur-md px-6 py-4 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-linear-to-tr from-violet-600 to-indigo-600 flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                                FT
                            </span>
                        </div>
                        <span className="font-bold text-lg text-neutral-100 tracking-tight">
                            FinTrack
                        </span>
                    </div>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLogout}
                        className="text-neutral-400 hover:text-red-400 transition-colors"
                    >
                        <LogOut className="h-4 w-4 mr-2" />
                        Выйти
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12 flex flex-col gap-10">
                {/* Hero Section с общим балансом */}
                <section className="relative overflow-hidden rounded-3xl border border-neutral-800/60 bg-linear-to-b from-neutral-900/50 to-neutral-950/80 p-8 md:p-10 shadow-2xl">
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="flex flex-col gap-6 relative z-10">
                        <div className="flex items-center gap-2 text-sm font-semibold tracking-wider text-violet-400 uppercase">
                            <Coins className="h-4 w-4" />
                            Общие сбережения
                        </div>

                        <div className="flex flex-wrap gap-x-8 gap-y-4 items-baseline">
                            {Object.keys(totalBalances).length === 0 ? (
                                <span className="text-4xl md:text-5xl font-bold tracking-tight text-white">
                                    0,00 ₽
                                </span>
                            ) : (
                                Object.entries(totalBalances).map(
                                    ([currency, balance]) => {
                                        const formatter = new Intl.NumberFormat(
                                            "ru-RU",
                                            {
                                                style: "currency",
                                                currency,
                                                minimumFractionDigits: 2,
                                            },
                                        );
                                        return (
                                            <div
                                                key={currency}
                                                className="flex flex-col gap-1"
                                            >
                                                <span className="text-4xl md:text-5xl font-bold tracking-tight text-white">
                                                    {formatter.format(balance)}
                                                </span>
                                            </div>
                                        );
                                    },
                                )
                            )}
                        </div>
                    </div>
                </section>

                {/* Секция кошельков */}
                <section className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Wallet className="h-5 w-5 text-neutral-400" />
                            <h2 className="text-xl font-bold text-neutral-100">
                                Мои кошельки
                            </h2>
                        </div>

                        <Button
                            size="sm"
                            className="gap-2 shadow-violet-500/10"
                        >
                            <Plus className="h-4 w-4" />
                            Добавить кошелек
                        </Button>
                    </div>

                    {!accounts || accounts.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-neutral-800/80 bg-neutral-950/20 p-12 text-center flex flex-col items-center gap-4">
                            <div className="p-4 rounded-2xl bg-neutral-900/50 text-neutral-400 border border-neutral-800/50">
                                <Wallet className="h-8 w-8" />
                            </div>
                            <div className="flex flex-col gap-1 max-w-sm">
                                <h3 className="font-bold text-neutral-200">
                                    Кошельков пока нет
                                </h3>
                                <p className="text-sm text-neutral-400">
                                    Создайте свой первый кошелек, чтобы начать
                                    отслеживать доходы и расходы.
                                </p>
                            </div>
                            <Button size="sm" className="mt-2">
                                Создать кошелек
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {accounts.map((account) => (
                                <AccountCard
                                    key={account.id}
                                    account={account}
                                />
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};
