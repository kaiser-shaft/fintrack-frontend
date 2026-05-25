"use client";

import React, { useState, useMemo, SubmitEvent } from "react";
import { z } from "zod";
import {
    X,
    ArrowDownRight,
    ArrowUpRight,
    DollarSign,
    FileText,
} from "lucide-react";
import { Button, Input } from "@/shared/ui";
import { useAccounts } from "@/entities/account";
import { useCategories } from "@/entities/category";
import { useCreateTransaction } from "../model/use-create-transaction";

interface CreateTransactionDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

const transactionSchema = z.object({
    accountId: z.uuid("Выберите кошелек для операции"),
    categoryId: z.uuid("Выберите категорию операции"),
    amount: z.preprocess(
        (val) => (val === "" ? undefined : Number(val)),
        z
            .number("Введите числовое значение")
            .positive("Сумма должна быть больше нуля"),
    ),
    description: z
        .string()
        .min(1, "Описание обязательно")
        .max(255, "Описание слишком длинное"),
    date: z.string().min(1, "Укажите дату операции"),
});

export const CreateTransactionDialog = ({
    isOpen,
    onClose,
}: CreateTransactionDialogProps) => {
    const { data: accounts = [] } = useAccounts();
    const { data: categories = [] } = useCategories();
    const {
        mutate: createTransaction,
        isPending,
        error,
    } = useCreateTransaction();

    // Стейты формы
    const [type, setType] = useState<"expense" | "income">("expense");
    const [accountId, setAccountId] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState(() =>
        new Date().toISOString().slice(0, 16),
    );

    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    // Фильтрация категорий по типу
    const filteredCategories = useMemo(() => {
        return categories.filter((cat) => cat.type === type);
    }, [categories, type]);

    // ВЫЧИСЛЯЕМЫЕ ЗНАЧЕНИЯ ПО УМОЛЧАНИЮ (Вместо useEffect)
    // Если пользователь еще ничего не выбрал вручную, берем первый доступный элемент
    const effectiveAccountId = accountId || accounts[0]?.id || "";
    const effectiveCategoryId = categoryId || filteredCategories[0]?.id || "";

    if (!isOpen) return null;

    const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormErrors({});

        // Валидируем данные, используя "эффективные" (выбранные по дефолту) ID
        const validationResult = transactionSchema.safeParse({
            accountId: effectiveAccountId,
            categoryId: effectiveCategoryId,
            amount,
            description,
            date,
        });

        if (!validationResult.success) {
            const errors: Record<string, string> = {};
            validationResult.error.issues.forEach((err) => {
                if (err.path[0]) {
                    errors[err.path[0].toString()] = err.message;
                }
            });
            setFormErrors(errors);
            return;
        }

        createTransaction(
            {
                account_id: effectiveAccountId,
                category_id: effectiveCategoryId,
                amount: Number(amount),
                description: description.trim(),
                date: new Date(date).toISOString(),
            },
            {
                onSuccess: () => {
                    setAmount("");
                    setDescription("");
                    setAccountId(""); // Сбрасываем в пустоту, чтобы снова сработал дефолт
                    setCategoryId("");
                    setDate(new Date().toISOString().slice(0, 16));
                    setFormErrors({});
                    onClose();
                },
            },
        );
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            onClick={handleBackdropClick}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs transition-opacity duration-300"
        >
            <div className="relative w-full max-w-md bg-neutral-950 border border-neutral-800/80 p-6 rounded-2xl flex flex-col gap-6 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

                {/* Header */}
                <div className="flex items-start justify-between relative z-10">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-xl font-bold text-neutral-100">
                            Добавить операцию
                        </h2>
                        <p className="text-xs text-neutral-400">
                            Внесите данные о доходе или расходе средств.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isPending}
                        className="text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/80 p-1.5 rounded-lg transition-colors disabled:opacity-50"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {accounts.length === 0 ? (
                    <div className="text-center py-6 flex flex-col items-center gap-3 relative z-10">
                        <p className="text-sm text-neutral-400">
                            Для добавления операции сначала создайте хотя бы
                            один кошелек.
                        </p>
                        <Button size="sm" onClick={onClose}>
                            Понятно
                        </Button>
                    </div>
                ) : (
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-4 relative z-10"
                    >
                        {/* Переключатель Доход / Расход */}
                        <div className="grid grid-cols-2 p-1 bg-neutral-900 rounded-xl border border-neutral-800/60">
                            <button
                                type="button"
                                onClick={() => {
                                    setType("expense");
                                    setCategoryId(""); // Сбрасываем выбранную категорию при смене типа
                                }}
                                className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all
                                        ${
                                            type === "expense"
                                                ? "bg-red-500/10 border border-red-500/20 text-red-400 shadow-sm"
                                                : "text-neutral-400 hover:text-neutral-200"
                                        }`}
                            >
                                <ArrowDownRight className="h-4 w-4" />
                                Расход
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setType("income");
                                    setCategoryId(""); // Сбрасываем выбранную категорию при смене типа
                                }}
                                className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all
                                        ${
                                            type === "income"
                                                ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-sm"
                                                : "text-neutral-400 hover:text-neutral-200"
                                        }`}
                            >
                                <ArrowUpRight className="h-4 w-4" />
                                Доход
                            </button>
                        </div>

                        {/* Выбор кошелька */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-neutral-400 px-0.5">
                                Кошелек
                            </label>
                            <select
                                value={effectiveAccountId}
                                onChange={(e) => setAccountId(e.target.value)}
                                className="w-full bg-neutral-950/40 text-neutral-100 border border-neutral-800/80 rounded-xl py-3.5 px-4 outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/60 text-sm transition-all"
                            >
                                {accounts.map((acc) => (
                                    <option
                                        key={acc.id}
                                        value={acc.id}
                                        className="bg-neutral-950 text-neutral-100"
                                    >
                                        {acc.name} ({acc.balance} {acc.currency}
                                        )
                                    </option>
                                ))}
                            </select>
                            {formErrors.accountId && (
                                <span className="text-xs text-red-500 px-0.5">
                                    {formErrors.accountId}
                                </span>
                            )}
                        </div>

                        {/* Выбор категории */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-neutral-400 px-0.5">
                                Категория
                            </label>
                            <select
                                value={effectiveCategoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                className="w-full bg-neutral-950/40 text-neutral-100 border border-neutral-800/80 rounded-xl py-3.5 px-4 outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/60 text-sm transition-all"
                                disabled={filteredCategories.length === 0}
                            >
                                {filteredCategories.length === 0 ? (
                                    <option
                                        value=""
                                        className="bg-neutral-950 text-neutral-500"
                                    >
                                        Нет доступных категорий
                                    </option>
                                ) : (
                                    filteredCategories.map((cat) => (
                                        <option
                                            key={cat.id}
                                            value={cat.id}
                                            className="bg-neutral-950 text-neutral-100"
                                        >
                                            {cat.name}
                                        </option>
                                    ))
                                )}
                            </select>
                            {formErrors.categoryId && (
                                <span className="text-xs text-red-500 px-0.5">
                                    {formErrors.categoryId}
                                </span>
                            )}
                        </div>

                        {/* Сумма и Дата */}
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Сумма операции"
                                type="number"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                error={formErrors.amount}
                                disabled={isPending}
                                leftIcon={
                                    <DollarSign className="h-4 w-4 text-neutral-500" />
                                }
                            />
                            <Input
                                label="Дата и время"
                                type="datetime-local"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                error={formErrors.date}
                                disabled={isPending}
                            />
                        </div>

                        <Input
                            label="Описание операции"
                            placeholder="Например, Покупка продуктов, Зарплата"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            error={
                                formErrors.description ||
                                (error ? error.message : undefined)
                            }
                            disabled={isPending}
                            leftIcon={
                                <FileText className="h-4 w-4 text-neutral-500" />
                            }
                        />

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3 mt-2">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={onClose}
                                disabled={isPending}
                            >
                                Отмена
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                isLoading={isPending}
                            >
                                Сохранить
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};
