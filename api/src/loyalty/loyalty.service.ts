import { Injectable } from '@nestjs/common';

@Injectable()
export class LoyaltyService {
  getCard(userId: string) {
    return {
      userId,
      qrCodeValue: `biltoki-loyalty-${userId}`,
      points: 120,
      tier: 'SILVER',
      perks: ['Accès prioritaire ateliers', 'Offres flash exclusives'],
    };
  }

  addPoints(userId: string, hallId: string, points = 10) {
    return {
      userId,
      hallId,
      pointsEarned: points,
      scanSource: 'ENTRY_OR_CHECKOUT',
    };
  }
}
