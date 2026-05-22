"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock } from "lucide-react";
import {
    Button,
    Input,
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/shared/ui";
import { useRegisterMutation } from "../model/use-auth-mutations";

export const RegisterForm = () => {
    const router = useRouter();
    const registerMutation = useRegisterMutation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [formError, setFormError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const validate = () => {
        let isValid = true;

        if (!email) {
            setEmailError("Электронная почта обязательна");
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setEmailError("Введите корректный email");
            isValid = false;
        } else {
            setEmailError("");
        }

        if (!password) {
            setPasswordError("Пароль обязателен");
            isValid = false;
        } else if (password.length < 8) {
            setPasswordError("Пароль должен содержать минимум 8 символов");
            isValid = false;
        } else {
            setPasswordError("");
        }

        if (password !== confirmPassword) {
            setConfirmPasswordError("Пароли не совпадают");
            isValid = false;
        } else {
            setConfirmPasswordError("");
        }

        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError("");
        setSuccessMessage("");

        if (!validate()) return;

        registerMutation.mutate(
            { email, password },
            {
                onSuccess: () => {
                    setSuccessMessage(
                        "Регистрация успешна! Перенаправление на страницу входа...",
                    );
                    setTimeout(() => {
                        router.push("/login");
                    }, 2000);
                },
                onError: (err) => {
                    setFormError(
                        err.message ||
                            "Пользователь с таким email уже существует",
                    );
                },
            },
        );
    };

    return (
        <Card className="w-full max-w-md shadow-2xl">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold bg-linear-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                    Создать аккаунт
                </CardTitle>
                <CardDescription>
                    Начните контролировать свои доходы и расходы уже сегодня
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {successMessage && (
                        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
                            {successMessage}
                        </div>
                    )}

                    {formError && (
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                            {formError}
                        </div>
                    )}

                    <Input
                        id="email"
                        type="email"
                        label="Электронная почта"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={emailError}
                        leftIcon={<Mail className="h-4 w-4" />}
                        disabled={
                            registerMutation.isPending || !!successMessage
                        }
                    />

                    <Input
                        id="password"
                        type="password"
                        label="Пароль"
                        placeholder="Минимум 8 символов"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={passwordError}
                        leftIcon={<Lock className="h-4 w-4" />}
                        disabled={
                            registerMutation.isPending || !!successMessage
                        }
                    />

                    <Input
                        id="confirmPassword"
                        type="password"
                        label="Подтверждение пароля"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        error={confirmPasswordError}
                        leftIcon={<Lock className="h-4 w-4" />}
                        disabled={
                            registerMutation.isPending || !!successMessage
                        }
                    />

                    <Button
                        type="submit"
                        fullWidth
                        isLoading={registerMutation.isPending}
                        disabled={!!successMessage}
                        className="mt-2"
                    >
                        Зарегистрироваться
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm text-neutral-400">
                    Уже есть аккаунт?{" "}
                    <Link
                        href="/login"
                        className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
                    >
                        Войти
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
};
