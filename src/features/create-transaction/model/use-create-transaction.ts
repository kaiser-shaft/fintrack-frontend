import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTransaction } from "../api/create-transaction";

export const useCreateTransaction = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createTransaction,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["accounts"] });
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
        },
    });
};
