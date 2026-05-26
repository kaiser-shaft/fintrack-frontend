export interface AnalyticsCategoryReport {
    category_name: string;
    amount: number;
}

export interface AnalyticsSummary {
    total_income: number;
    total_expense: number;
    by_category: AnalyticsCategoryReport[];
}
