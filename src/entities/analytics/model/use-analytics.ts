import { useQuery } from "@tanstack/react-query";
import { getAnalyticsSummary } from "../api/analytics-api";

export const useAnalytics = (from?: string, to?: string) => {
    return useQuery({
        queryKey: ["analytics", from, to],
        queryFn: () => getAnalyticsSummary(from, to),
    });
};
