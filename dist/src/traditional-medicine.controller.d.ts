export declare class TraditionalMedicineController {
    getAll(): Promise<(import("mongoose").Document<unknown, {}, {
        scientific_name?: string;
        local_name?: string;
        habit?: string;
        habitat?: string;
        parts_used?: string;
        uses?: string;
        amharic_name?: string;
        amharic_uses?: string;
    }> & {
        scientific_name?: string;
        local_name?: string;
        habit?: string;
        habitat?: string;
        parts_used?: string;
        uses?: string;
        amharic_name?: string;
        amharic_uses?: string;
    } & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
}
