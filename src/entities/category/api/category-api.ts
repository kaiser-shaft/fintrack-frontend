import { apiRequest } from "@/shared/api";
import { Category } from "../model/types";

export const getCategories = (): Promise<{ data: Category[] }> => {
    return apiRequest<{ data: Category[] }>("/api/v1/categories");
};
