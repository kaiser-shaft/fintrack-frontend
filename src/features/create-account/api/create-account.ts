import { Account } from "@/entities/account";
import { apiRequest } from "@/shared/api";

export const createAccount = (
    data: Pick<Account, "name" | "currency">,
): Promise<Account> => {
    return apiRequest<Account>("/api/v1/accounts", {
        method: "POST",
        body: JSON.stringify(data),
    });
};
