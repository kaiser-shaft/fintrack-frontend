"use client";

import { MouseEvent, SubmitEvent, useState } from "react";
import { X, Wallet, Globe } from "lucide-react";
import { Button, Input } from "@/shared/ui";
import { useCreateAccount } from "../model/use-create-account";

interface CreateAccountDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

// Список поддерживаемых валют с премиальным форматированием для выбора
const SUPPORTED_CURRENCIES = [
    { code: "RUB", symbol: "₽", name: "Российский рубль" },
    { code: "USD", symbol: "$", name: "Доллар США" },
    { code: "EUR", symbol: "€", name: "Евро" },
];

export const CreateAccountDialog = ({
    isOpen,
    onClose,
}: CreateAccountDialogProps) => {
    const [name, setName] = useState("");
    const [currency, setCurrency] = useState("RUB");
    const [validationError, setValidationError] = useState("");

    // Твой кастомный мутационный хук из модели
    const { mutate: createAccount, isPending, error } = useCreateAccount();

    if (!isOpen) return null;

    const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setValidationError("");

        const trimmedName = name.trim();
        if (!trimmedName) {
            setValidationError("Название кошелька обязательно");
            return;
        }

        if (trimmedName.length > 100) {
            setValidationError("Название не должно превышать 100 символов");
            return;
        }

        // Вызываем мутацию
        createAccount(
            { name: trimmedName, currency },
            {
                onSuccess: () => {
                    // Сбрасываем стейт при успехе
                    setName("");
                    setCurrency("RUB");
                    onClose();
                },
            },
        );
    };

    const handleBackdropClick = (e: MouseEvent) => {
        // Закрываем окно только при клике на сам фон, а не на само тело диалога
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
                {/* Декоративный фоновый фиолетовый блик */}
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

                {/* Заголовок модального окна */}
                <div className="flex items-start justify-between relative z-10">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-xl font-bold text-neutral-100 flex items-center gap-2">
                            <Wallet className="h-5 w-5 text-violet-400" />
                            Создать кошелек
                        </h2>
                        <p className="text-xs text-neutral-400">
                            Укажите название и основную валюту для вашего нового
                            кошелька.
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

                {/* Форма */}
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-5 relative z-10"
                >
                    <Input
                        label="Название кошелька"
                        placeholder="Например, Наличные, Карта Сбер"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        // Выводим либо локальную ошибку валидации, либо ошибку бэкенда
                        error={
                            validationError ||
                            (error ? error.message : undefined)
                        }
                        disabled={isPending}
                        maxLength={101}
                        leftIcon={
                            <Wallet className="h-4 w-4 text-neutral-500" />
                        }
                    />

                    {/* Выбор валюты */}
                    <div className="flex flex-col gap-2">
                        <span className="text-xs font-medium text-neutral-400 px-0.5 flex items-center gap-1.5">
                            <Globe className="h-3.5 w-3.5" />
                            Валюта кошелька
                        </span>
                        <div className="grid grid-cols-3 gap-3">
                            {SUPPORTED_CURRENCIES.map((curr) => {
                                const isActive = currency === curr.code;
                                return (
                                    <button
                                        key={curr.code}
                                        type="button"
                                        disabled={isPending}
                                        onClick={() => setCurrency(curr.code)}
                                        className={`py-3 px-4 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all duration-200 active:scale-95 disabled:opacity-50
                                                ${
                                                    isActive
                                                        ? "bg-linear-to-tr from-violet-600/20 to-indigo-600/20 border-violet-500/60 shadow-lg shadow-violet-500/5"
                                                        : "bg-neutral-950/40 border-neutral-800/80 hover:border-neutral-700/60 hover:bg-neutral-900/20"
                                                }
                                            `}
                                    >
                                        <span
                                            className={`text-lg font-bold ${isActive ? "text-violet-400" : "text-neutral-400"}`}
                                        >
                                            {curr.symbol}
                                        </span>
                                        <span
                                            className={`text-xs font-medium ${isActive ? "text-neutral-100" : "text-neutral-500"}`}
                                        >
                                            {curr.code}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Кнопки действий */}
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
                            Создать
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
