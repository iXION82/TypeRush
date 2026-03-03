import api from "../api/api";

interface TextFetchParams {
    mode: string;
    count?: number;
    numbers: boolean;
    punctuation: boolean;
}

export const fetchText = async ({ mode, count, numbers, punctuation }: TextFetchParams): Promise<string> => {
    try {
        const response = await api.get("/text", {
            params: {
                mode,
                count,
                numbers,
                punctuation
            }
        });
        return response.data.content;
    } catch (error) {
        console.error("Failed to fetch text", error);
        return "The quick brown fox jumps over the lazy dog. (Fallback: Network error)";
    }
};
