import { Body, Controller, Post } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('subscribe')
  subscribe(@Body('userId') userId: string, @Body('hallId') hallId: string) {
    return this.notificationsService.subscribeToHall(userId, hallId);
  }

  @Post('hall')
  sendToHall(
    @Body('hallId') hallId: string,
    @Body('title') title: string,
    @Body('body') body: string,
    @Body('type') type: string,
  ) {
    return this.notificationsService.sendToHall(hallId, title, body, type);
  }

  @Post('global')
  sendGlobal(
    @Body('title') title: string,
    @Body('body') body: string,
    @Body('type') type: string,
  ) {
    return this.notificationsService.sendGlobal(title, body, type);
  }
}
