import { useQuery } from "@tanstack/react-query";
import { getAccounts } from "../api/account-api";

export const useAccounts = () => {
    return useQuery({
        queryKey: ["accounts"],
        queryFn: getAccounts,
        select: (response) => response.data,
    });
};
