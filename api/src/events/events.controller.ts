import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  findAll(@Query('hallId') hallId?: string) {
    return this.eventsService.findAll(hallId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Post(':id/interested')
  markInterested(@Param('id') id: string, @Body('userId') userId: string) {
    return this.eventsService.markInterested(id, userId);
  }
}
