import { apiRequest } from "@/shared/api";
import { AnalyticsSummary } from "../model/types";

export const getAnalyticsSummary = (
    from?: string,
    to?: string,
): Promise<AnalyticsSummary> => {
    const params = new URLSearchParams();
    if (from) params.append("from", from);
    if (to) params.append("to", to);

    const query = params.toString() ? `?${params.toString()}` : "";
    return apiRequest<AnalyticsSummary>(`/api/v1/analytics/summary${query}`);
};
