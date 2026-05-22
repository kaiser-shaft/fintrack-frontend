"use client";

import { useRouter } from "next/navigation";
import { useLoginMutation } from "../model/use-auth-mutations";
import { useState } from "react";
import type { SubmitEvent } from "react";
import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Input,
} from "@/shared/ui";
import { Lock, Mail } from "lucide-react";
import Link from "next/link";

export const LoginForm = () => {
    const router = useRouter();
    const loginMutation = useLoginMutation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [formError, setFormError] = useState("");

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
        } else {
            setPasswordError("");
        }

        return isValid;
    };

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormError("");

        if (!validate()) return;

        loginMutation.mutate(
            { email, password },
            {
                onSuccess: () => {
                    router.push("/");
                    router.refresh();
                },
                onError: (err) => {
                    setFormError(err.message || "Неверный email или пароль");
                },
            },
        );
    };

    return (
        <Card className="w-full max-w-md shadow-2xl">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold bg-linear-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                    Рады возвращению!
                </CardTitle>
                <CardDescription>
                    Войдите в свою учетную запись для управления финансами
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                        disabled={loginMutation.isPending}
                    />

                    <Input
                        id="password"
                        type="password"
                        label="Пароль"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={passwordError}
                        leftIcon={<Lock className="h-4 w-4" />}
                        disabled={loginMutation.isPending}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        isLoading={loginMutation.isPending}
                        className="mt-2"
                    >
                        Войти в систему
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm text-neutral-400">
                    Нет аккаунта?{" "}
                    <Link
                        href="/register"
                        className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
                    >
                        Зарегистрироваться
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
};
