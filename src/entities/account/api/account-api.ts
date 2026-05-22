import { apiRequest } from "@/shared/api";
import type { Account } from "../model/types";

export const getAccounts = (): Promise<{ data: Account[] }> => {
    return apiRequest<{ data: Account[] }>("/api/v1/accounts");
};
