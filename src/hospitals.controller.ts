import { Controller, Get } from '@nestjs/common';

@Controller('hospitals')
export class HospitalsController {
  @Get()
  async getAll() {
    // Replace this with your real data source or database call
    return [
      { name: "Black Lion Hospital", lat: 9.037, lng: 38.751 },
      { name: "St. Paul Hospital", lat: 9.040, lng: 38.726 }
    ];
  }
} 