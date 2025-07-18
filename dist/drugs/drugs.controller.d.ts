import { DrugsService } from './drugs.service';
export declare class DrugsController {
    private readonly drugsService;
    constructor(drugsService: DrugsService);
    getDrugs(startsWith: string): Promise<string[]>;
    getDrugDetail(name: string): Promise<any>;
}
