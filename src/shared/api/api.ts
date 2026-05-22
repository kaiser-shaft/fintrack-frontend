const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function apiRequest<T>(
    path: string,
    options?: RequestInit,
): Promise<T> {
    const response = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        },
        credentials: "include", // Обязательно для отправки httpOnly cookies!
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Something went wrong");
    }

    const text = await response.text();
    return (text ? JSON.parse(text) : {}) as T;
}
