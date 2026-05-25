import { Transaction } from "@/entities/transaction";
import { apiRequest } from "@/shared/api";

export type CreateTransactionPayload = Pick<
    Transaction,
    "account_id" | "category_id" | "amount" | "description"
> & { date: string };

export const createTransaction = (
    data: CreateTransactionPayload,
): Promise<Transaction> => {
    return apiRequest<Transaction>("/api/v1/transactions", {
        method: "POST",
        body: JSON.stringify(data),
    });
};
