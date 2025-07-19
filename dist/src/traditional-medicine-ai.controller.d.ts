export declare class TraditionalMedicineAiController {
    recommendTraditional(body: {
        symptoms: string;
    }): Promise<{
        recommendations: string;
    }>;
    geminiApiCall(prompt: string): Promise<string>;
}
