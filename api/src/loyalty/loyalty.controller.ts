import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { LoyaltyService } from './loyalty.service';

@Controller('loyalty')
export class LoyaltyController {
  constructor(private readonly loyaltyService: LoyaltyService) {}

  @Get(':userId/card')
  getCard(@Param('userId') userId: string) {
    return this.loyaltyService.getCard(userId);
  }

  @Post(':userId/points')
  addPoints(
    @Param('userId') userId: string,
    @Body('hallId') hallId: string,
    @Body('points') points?: number,
  ) {
    return this.loyaltyService.addPoints(userId, hallId, points);
  }
}
