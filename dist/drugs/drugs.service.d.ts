import { Repository } from 'typeorm';
import { Drug } from './entities/drug.entity';
export declare class DrugsService {
    private drugRepository;
    constructor(drugRepository: Repository<Drug>);
    getDrugsByFirstLetter(letter: string): Promise<string[]>;
    getDrugDetailByName(name: string): Promise<any>;
}
