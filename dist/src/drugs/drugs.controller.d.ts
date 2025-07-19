import { DrugsService } from './drugs.service';
export declare class DrugsController {
    private readonly drugsService;
    constructor(drugsService: DrugsService);
    searchOpenFda(startsWith: string, onlyTablets?: string): Promise<{
        drugs: any[];
    }>;
    searchOpenFdaByName(query: string): Promise<{
        drugs: any[];
    }>;
    getDailyMedDetail(name: string): Promise<any>;
    searchDailyMedByName(query: string): Promise<{
        drugs: any[];
    }>;
    searchRxImage(imprint: string, color?: string, shape?: string): Promise<any>;
    searchRxNavByName(query: string): Promise<{
        drugs: any[];
    }>;
    searchDrugsDotComByName(query: string): Promise<{
        drugs: any[];
    }>;
}
