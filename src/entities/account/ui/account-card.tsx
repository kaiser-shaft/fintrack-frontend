"use client";

import { Coins, CreditCard, PiggyBank, Wallet } from "lucide-react";
import { Account } from "../model/types";
import { Card } from "@/shared/ui";

interface AccountCardProps {
    account: Account;
}

const getAccountIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (
        lowerName.includes("карт") ||
        lowerName.includes("bank") ||
        lowerName.includes("сбер")
    ) {
        return <CreditCard className="h-6 w-6" />;
    }
    if (
        lowerName.includes("копил") ||
        lowerName.includes("сбережения") ||
        lowerName.includes("piggy")
    ) {
        return <PiggyBank className="h-6 w-6" />;
    }
    if (lowerName.includes("кэш") || lowerName.includes("наличные")) {
        return <Coins className="h-6 w-6" />;
    }
    return <Wallet className="h-6 w-6" />;
};

const getAccountGradient = (name: string) => {
    const gradients = [
        {
            bg: "bg-gradient-to-br from-violet-600/10 via-transparent to-indigo-600/5 hover:border-violet-500/30 hover:shadow-violet-950/10",
            badge: "bg-violet-500/10 text-violet-400 border-violet-500/20",
            iconColor: "text-violet-400",
        },
        {
            bg: "bg-gradient-to-br from-emerald-600/10 via-transparent to-teal-600/5 hover:border-emerald-500/30 hover:shadow-emerald-950/10",
            badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
            iconColor: "text-emerald-400",
        },
        {
            bg: "bg-gradient-to-br from-rose-600/10 via-transparent to-orange-600/5 hover:border-rose-500/30 hover:shadow-rose-950/10",
            badge: "bg-rose-500/10 text-rose-400 border-rose-500/20",
            iconColor: "text-rose-400",
        },
        {
            bg: "bg-gradient-to-br from-cyan-600/10 via-transparent to-blue-600/5 hover:border-cyan-500/30 hover:shadow-cyan-950/10",
            badge: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
            iconColor: "text-cyan-400",
        },
    ];

    const index = name.length > 0 ? name.charCodeAt(0) % gradients.length : 0;
    return gradients[index];
};

export const AccountCard = ({ account }: AccountCardProps) => {
    const styles = getAccountGradient(account.name);

    // Форматирование валюты
    const formatter = new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: account.currency || "USD",
        minimumFractionDigits: 2,
    });

    return (
        <Card
            hoverEffect
            className={`group relative overflow-hidden transition-all duration-300 border-neutral-800/60 bg-neutral-950/40 p-6 flex flex-col gap-6 ${styles.bg}`}
        >
            {/* Декоративный фоновый блик */}
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-white/2 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-transform duration-500" />

            <div className="flex items-start justify-between">
                <div
                    className={`p-3 rounded-xl bg-neutral-900/60 border border-neutral-800/80 transition-colors duration-300 group-hover:bg-neutral-900/40 ${styles.iconColor}`}
                >
                    {getAccountIcon(account.name)}
                </div>
                <span
                    className={`text-xs px-2.5 py-1 rounded-full border font-medium ${styles.badge}`}
                >
                    {account.currency}
                </span>
            </div>

            <div className="flex flex-col gap-1 mt-auto">
                <span className="text-sm font-medium text-neutral-400 truncate group-hover:text-neutral-300 transition-colors">
                    {account.name}
                </span>
                <span className="text-2xl font-bold tracking-tight text-neutral-100 group-hover:text-white transition-colors">
                    {formatter.format(account.balance)}
                </span>
            </div>
        </Card>
    );
};
