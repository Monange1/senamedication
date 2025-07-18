export declare class HospitalsController {
    getAll(): Promise<{
        name: string;
        lat: number;
        lng: number;
    }[]>;
}
