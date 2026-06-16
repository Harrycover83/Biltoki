import { Injectable } from '@nestjs/common';

export interface UpdateProfileDto {
  name?: string;
  phone?: string;
  preferredHallId?: string;
  dietaryPreferenceCodes?: string[];
}

@Injectable()
export class UsersService {
  getProfile(userId: string) {
    return {
      id: userId,
      name: 'Scaffold User',
      email: 'user@biltoki.fr',
      phone: '+33 6 00 00 00 00',
      preferredHallId: null,
      dietaryPreferenceCodes: ['VEGAN'],
    };
  }

  updateProfile(userId: string, payload: UpdateProfileDto) {
    return {
      ...this.getProfile(userId),
      ...payload,
    };
  }
}
