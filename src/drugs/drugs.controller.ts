import { Controller, Get, Query, HttpException, HttpStatus } from '@nestjs/common';
import { DrugsService } from './drugs.service';

@Controller('drugs')
export class DrugsController {
  constructor(private readonly drugsService: DrugsService) {}

  @Get('openfda')
  async searchOpenFda(@Query('startsWith') startsWith: string, @Query('onlyTablets') onlyTablets?: string) {
    if (!startsWith) {
      throw new HttpException('Missing startsWith query parameter', HttpStatus.BAD_REQUEST);
    }
    // onlyTablets defaults to true unless explicitly set to 'false'
    const tablets = onlyTablets !== 'false';
    return { drugs: await this.drugsService.searchOpenFdaDrugsByLetter(startsWith, tablets) };
  }

  @Get('openfda/search')
  async searchOpenFdaByName(@Query('query') query: string) {
    if (!query) {
      throw new HttpException('Missing query parameter', HttpStatus.BAD_REQUEST);
    }
    return { drugs: await this.drugsService.searchOpenFdaDrugsByName(query) };
  }

  @Get('dailymed/detail')
  async getDailyMedDetail(@Query('name') name: string) {
    if (!name) {
      throw new HttpException('Missing name query parameter', HttpStatus.BAD_REQUEST);
    }
    return await this.drugsService.getDrugDetailByName(name);
  }

  @Get('dailymed/search')
  async searchDailyMedByName(@Query('query') query: string) {
    if (!query) {
      throw new HttpException('Missing query parameter', HttpStatus.BAD_REQUEST);
    }
    return { drugs: await this.drugsService.searchDailyMedDrugsByName(query) };
  }

  @Get('rximage')
  async searchRxImage(
    @Query('imprint') imprint: string,
    @Query('color') color?: string,
    @Query('shape') shape?: string
  ) {
    if (!imprint) {
      throw new HttpException('Missing imprint query parameter', HttpStatus.BAD_REQUEST);
    }
    return await this.drugsService.searchRxImage({ imprint, color, shape });
  }

  @Get('rxnav/search')
  async searchRxNavByName(@Query('query') query: string) {
    if (!query) {
      throw new HttpException('Missing query parameter', HttpStatus.BAD_REQUEST);
    }
    return { drugs: await this.drugsService.searchRxNavDrugsByName(query) };
  }

  @Get('drugsdotcom/search')
  async searchDrugsDotComByName(@Query('query') query: string) {
    if (!query) {
      throw new HttpException('Missing query parameter', HttpStatus.BAD_REQUEST);
    }
    return { drugs: await this.drugsService.searchDrugsDotComByName(query) };
  }
}
