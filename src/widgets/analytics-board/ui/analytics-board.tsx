"use client";

import { useState, useMemo } from "react";
import { useAnalytics } from "@/entities/analytics";
import { Card, CardContent } from "@/shared/ui";
import {
    TrendingUp,
    TrendingDown,
    Calendar,
    Wallet,
    PieChart as PieIcon,
} from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

const CHART_COLORS = [
    "#8b5cf6", // Violet
    "#3b82f6", // Blue
    "#10b981", // Emerald
    "#f59e0b", // Amber
    "#ef4444", // Red
    "#ec4899", // Pink
    "#06b6d4", // Cyan
    "#14b8a6", // Teal
];

type DatePreset = "all" | "month" | "30days" | "custom";

export const AnalyticsBoard = () => {
    const [preset, setPreset] = useState<DatePreset>("month");

    // Стейты для пользовательского диапазона
    const [startDate, setStartDate] = useState(() => {
        const d = new Date();
        d.setDate(1); // Первое число текущего месяца
        return d.toISOString().split("T")[0];
    });
    const [endDate, setEndDate] = useState(() => {
        return new Date().toISOString().split("T")[0];
    });

    // Расчет эффективных ISO-дат для передачи в React Query / API
    const { from, to } = useMemo(() => {
        const now = new Date();

        switch (preset) {
            case "all":
                return { from: undefined, to: undefined };
            case "month": {
                const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
                // Устанавливаем 00:00:00
                firstDay.setHours(0, 0, 0, 0);
                return {
                    from: firstDay.toISOString(),
                    to: undefined,
                };
            }
            case "30days": {
                const thirtyDaysAgo = new Date(
                    now.getTime() - 30 * 24 * 60 * 60 * 1000,
                );
                thirtyDaysAgo.setHours(0, 0, 0, 0);
                return {
                    from: thirtyDaysAgo.toISOString(),
                    to: undefined,
                };
            }
            case "custom": {
                if (!startDate) return { from: undefined, to: undefined };

                const fromDate = new Date(startDate);
                fromDate.setHours(0, 0, 0, 0);

                let toDate = undefined;
                if (endDate) {
                    const parsedTo = new Date(endDate);
                    parsedTo.setHours(23, 59, 59, 999);
                    toDate = parsedTo.toISOString();
                }

                return {
                    from: fromDate.toISOString(),
                    to: toDate,
                };
            }
            default:
                return { from: undefined, to: undefined };
        }
    }, [preset, startDate, endDate]);

    const { data: analytics, isLoading, error } = useAnalytics(from, to);

    // Вспомогательные вычисления
    const netBalance = useMemo(() => {
        if (!analytics) return 0;
        return analytics.total_income - analytics.total_expense;
    }, [analytics]);

    // Суммарные расходы для процентов
    const totalExpenses = useMemo(() => {
        if (!analytics || !analytics.by_category) return 0;
        return analytics.by_category.reduce((sum, cat) => sum + cat.amount, 0);
    }, [analytics]);

    // Данные для PieChart (recharts работает только с расходами в этом сценарии)
    const chartData = useMemo(() => {
        if (!analytics || !analytics.by_category) return [];
        return analytics.by_category
            .filter((cat) => cat.amount > 0)
            .map((cat) => ({
                name: cat.category_name,
                value: cat.amount,
            }));
    }, [analytics]);

    // Форматирование сумм
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("ru-RU", {
            style: "currency",
            currency: "RUB",
            minimumFractionDigits: 2,
        }).format(amount);
    };

    if (error) {
        return (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-center text-red-400">
                Произошла ошибка при загрузке аналитики: {error.message}
            </div>
        );
    }

    return (
        <section className="flex flex-col gap-6 w-full">
            {/* Панель фильтров по датам */}
            <div className="flex flex-wrap gap-4 items-center justify-between bg-neutral-950/40 border border-neutral-800/60 p-4 rounded-2xl backdrop-blur-md">
                <div className="flex items-center gap-2 text-neutral-300">
                    <Calendar className="h-5 w-5 text-violet-400" />
                    <span className="text-sm font-semibold">
                        Аналитический период:
                    </span>
                </div>

                <div className="flex flex-wrap gap-2 items-center">
                    <div className="flex p-0.5 bg-neutral-900/80 rounded-xl border border-neutral-800/60">
                        <button
                            onClick={() => setPreset("month")}
                            className={`py-1.5 px-3 rounded-lg text-xs font-medium transition-all ${
                                preset === "month"
                                    ? "bg-violet-600/10 border border-violet-500/20 text-violet-400"
                                    : "text-neutral-400 hover:text-neutral-200"
                            }`}
                        >
                            Этот месяц
                        </button>
                        <button
                            onClick={() => setPreset("30days")}
                            className={`py-1.5 px-3 rounded-lg text-xs font-medium transition-all ${
                                preset === "30days"
                                    ? "bg-violet-600/10 border border-violet-500/20 text-violet-400"
                                    : "text-neutral-400 hover:text-neutral-200"
                            }`}
                        >
                            30 дней
                        </button>
                        <button
                            onClick={() => setPreset("all")}
                            className={`py-1.5 px-3 rounded-lg text-xs font-medium transition-all ${
                                preset === "all"
                                    ? "bg-violet-600/10 border border-violet-500/20 text-violet-400"
                                    : "text-neutral-400 hover:text-neutral-200"
                            }`}
                        >
                            Все время
                        </button>
                        <button
                            onClick={() => setPreset("custom")}
                            className={`py-1.5 px-3 rounded-lg text-xs font-medium transition-all ${
                                preset === "custom"
                                    ? "bg-violet-600/10 border border-violet-500/20 text-violet-400"
                                    : "text-neutral-400 hover:text-neutral-200"
                            }`}
                        >
                            Свой период
                        </button>
                    </div>

                    {preset === "custom" && (
                        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="bg-neutral-900 border border-neutral-800 text-neutral-200 rounded-lg text-xs py-1.5 px-2 outline-none focus:border-violet-500/60 transition-colors"
                            />
                            <span className="text-neutral-500 text-xs">—</span>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="bg-neutral-900 border border-neutral-800 text-neutral-200 rounded-lg text-xs py-1.5 px-2 outline-none focus:border-violet-500/60 transition-colors"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Карточки финансового свода */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Доходы */}
                <Card
                    hoverEffect
                    className="relative overflow-hidden border-emerald-950/20 bg-linear-to-b from-neutral-900/40 to-neutral-950/60"
                >
                    <div className="absolute top-0 right-0 -translate-y-1/3 translate-x-1/3 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl" />
                    <CardContent className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
                            <TrendingUp className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-neutral-400 font-medium">
                                Получено доходов
                            </span>
                            {isLoading ? (
                                <div className="h-6 w-28 bg-neutral-800 rounded animate-pulse" />
                            ) : (
                                <span className="text-xl md:text-2xl font-bold text-neutral-100">
                                    {formatCurrency(
                                        analytics?.total_income || 0,
                                    )}
                                </span>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Расходы */}
                <Card
                    hoverEffect
                    className="relative overflow-hidden border-red-950/20 bg-linear-to-b from-neutral-900/40 to-neutral-950/60"
                >
                    <div className="absolute top-0 right-0 -translate-y-1/3 translate-x-1/3 w-32 h-32 bg-red-500/5 rounded-full blur-2xl" />
                    <CardContent className="flex items-center gap-4">
                        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">
                            <TrendingDown className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-neutral-400 font-medium">
                                Потрачено средств
                            </span>
                            {isLoading ? (
                                <div className="h-6 w-28 bg-neutral-800 rounded animate-pulse" />
                            ) : (
                                <span className="text-xl md:text-2xl font-bold text-neutral-100">
                                    {formatCurrency(
                                        analytics?.total_expense || 0,
                                    )}
                                </span>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Чистая дельта */}
                <Card
                    hoverEffect
                    className="relative overflow-hidden border-violet-950/20 bg-linear-to-b from-neutral-900/40 to-neutral-950/60"
                >
                    <div className="absolute top-0 right-0 -translate-y-1/3 translate-x-1/3 w-32 h-32 bg-violet-500/5 rounded-full blur-2xl" />
                    <CardContent className="flex items-center gap-4">
                        <div className="p-3 bg-violet-500/10 border border-violet-500/20 text-violet-400 rounded-xl">
                            <Wallet className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-neutral-400 font-medium">
                                Финансовый результат
                            </span>
                            {isLoading ? (
                                <div className="h-6 w-28 bg-neutral-800 rounded animate-pulse" />
                            ) : (
                                <span
                                    className={`text-xl md:text-2xl font-bold ${
                                        netBalance >= 0
                                            ? "text-emerald-400"
                                            : "text-red-400"
                                    }`}
                                >
                                    {netBalance >= 0 ? "+" : ""}
                                    {formatCurrency(netBalance)}
                                </span>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Блок графиков и распределения */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Круговая диаграмма (Donut Chart) */}
                <Card className="lg:col-span-2 flex flex-col gap-6 bg-linear-to-b from-neutral-900/40 to-neutral-950/60">
                    <div className="flex items-center gap-2 border-b border-neutral-800/40 pb-4">
                        <PieIcon className="h-4 w-4 text-violet-400" />
                        <h3 className="font-semibold text-neutral-200 text-sm">
                            Доли расходов
                        </h3>
                    </div>

                    <div className="flex-1 flex items-center justify-center min-h-64 relative">
                        {isLoading ? (
                            <div className="h-44 w-44 rounded-full border-8 border-neutral-800 border-t-violet-500 animate-spin" />
                        ) : chartData.length === 0 ? (
                            <div className="text-center flex flex-col items-center gap-2">
                                <span className="text-xs text-neutral-500">
                                    Нет расходных операций
                                </span>
                                <span className="text-[10px] text-neutral-600">
                                    Добавьте транзакции расходов, чтобы
                                    построить диаграмму
                                </span>
                            </div>
                        ) : (
                            <div className="h-64 w-full relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={chartData}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={85}
                                            paddingAngle={3}
                                        >
                                            {chartData.map((_, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={
                                                        CHART_COLORS[
                                                            index %
                                                                CHART_COLORS.length
                                                        ]
                                                    }
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "#0a0a0a",
                                                border: "1px solid #262626",
                                                borderRadius: "12px",
                                                padding: "10px 14px",
                                            }}
                                            itemStyle={{
                                                color: "#f5f5f5",
                                                fontSize: "12px",
                                                fontFamily: "inherit",
                                            }}
                                            formatter={(value: unknown) => [
                                                formatCurrency(
                                                    Number(value) || 0,
                                                ),
                                                "Сумма",
                                            ]}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-xs text-neutral-400 font-medium">
                                        Всего трат
                                    </span>
                                    <span className="text-sm font-bold text-neutral-100">
                                        {formatCurrency(totalExpenses)}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Подробный список категорий */}
                <Card className="lg:col-span-3 flex flex-col gap-6 bg-linear-to-b from-neutral-900/40 to-neutral-950/60">
                    <div className="flex items-center justify-between border-b border-neutral-800/40 pb-4">
                        <h3 className="font-semibold text-neutral-200 text-sm">
                            Распределение по категориям
                        </h3>
                        <span className="text-xs text-neutral-400">
                            Сортировка по убыванию
                        </span>
                    </div>

                    <div className="flex-1 flex flex-col gap-4 overflow-y-auto max-h-72 pr-1">
                        {isLoading ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="flex flex-col gap-2">
                                    <div className="flex justify-between">
                                        <div className="h-4 w-24 bg-neutral-800 rounded animate-pulse" />
                                        <div className="h-4 w-12 bg-neutral-800 rounded animate-pulse" />
                                    </div>
                                    <div className="h-2 w-full bg-neutral-900 rounded animate-pulse" />
                                </div>
                            ))
                        ) : !analytics ||
                          !analytics.by_category ||
                          analytics.by_category.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 gap-2">
                                <span className="text-xs text-neutral-500">
                                    Данные отсутствуют
                                </span>
                                <p className="text-[10px] text-neutral-600 max-w-xs">
                                    В выбранном периоде нет зарегистрированных
                                    расходов и доходов.
                                </p>
                            </div>
                        ) : (
                            analytics.by_category
                                .sort((a, b) => b.amount - a.amount)
                                .map((cat, idx) => {
                                    const percentage =
                                        totalExpenses > 0
                                            ? Math.round(
                                                  (cat.amount / totalExpenses) *
                                                      100,
                                              )
                                            : 0;

                                    return (
                                        <div
                                            key={cat.category_name}
                                            className="flex flex-col gap-1.5 group"
                                        >
                                            <div className="flex justify-between items-baseline">
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className="w-2.5 h-2.5 rounded-full shrink-0"
                                                        style={{
                                                            backgroundColor:
                                                                CHART_COLORS[
                                                                    idx %
                                                                        CHART_COLORS.length
                                                                ],
                                                        }}
                                                    />
                                                    <span className="text-xs text-neutral-200 font-medium group-hover:text-neutral-100 transition-colors">
                                                        {cat.category_name}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xs font-semibold text-neutral-300">
                                                        {formatCurrency(
                                                            cat.amount,
                                                        )}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-neutral-500 w-8 text-right shrink-0">
                                                        {percentage}%
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Прогресс-бар */}
                                            <div className="h-2 w-full bg-neutral-950 rounded-full overflow-hidden border border-neutral-900/40">
                                                <div
                                                    className="h-full rounded-full transition-all duration-500"
                                                    style={{
                                                        width: `${percentage}%`,
                                                        backgroundColor:
                                                            CHART_COLORS[
                                                                idx %
                                                                    CHART_COLORS.length
                                                            ],
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })
                        )}
                    </div>
                </Card>
            </div>
        </section>
    );
};
