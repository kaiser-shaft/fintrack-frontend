import { apiRequest } from "@/shared/api";
import type {
    RegisterRequest,
    AuthResponse,
    LoginRequest,
} from "@/shared/types";
import { useMutation } from "@tanstack/react-query";

export const useLoginMutation = () => {
    return useMutation<AuthResponse, Error, LoginRequest>({
        mutationFn: (data) =>
            apiRequest("/api/v1/auth/login", {
                method: "POST",
                body: JSON.stringify(data),
            }),
    });
};

export const useRegisterMutation = () => {
    return useMutation<void, Error, RegisterRequest>({
        mutationFn: (data) =>
            apiRequest("/api/v1/auth/register", {
                method: "POST",
                body: JSON.stringify(data),
            }),
    });
};
