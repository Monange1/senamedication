export declare class DrugsService {
    findAll(): Promise<any[]>;
    findByName(name: string): Promise<any | null>;
    searchOpenFdaDrugsByLetter(startsWith: string, tablets: boolean): Promise<any[]>;
    searchOpenFdaDrugsByName(query: string): Promise<any[]>;
    getDrugDetailByName(name: string): Promise<any>;
    searchDailyMedDrugsByName(query: string): Promise<any[]>;
    searchRxImage({ imprint, color, shape }: {
        imprint: string;
        color?: string;
        shape?: string;
    }): Promise<any>;
    searchRxNavDrugsByName(query: string): Promise<any[]>;
    searchDrugsDotComByName(query: string): Promise<any[]>;
}
