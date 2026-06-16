import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  subscribeToHall(userId: string, hallId: string) {
    return {
      userId,
      hallId,
      subscribed: true,
    };
  }

  sendToHall(hallId: string, title: string, body: string, type: string) {
    return {
      hallId,
      title,
      body,
      type,
      target: 'HALL_SUBSCRIBERS',
    };
  }

  sendGlobal(title: string, body: string, type: string) {
    return {
      title,
      body,
      type,
      target: 'GLOBAL',
    };
  }
}
