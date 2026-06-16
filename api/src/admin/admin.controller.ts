import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('halls')
  createHall(@Body() payload: Record<string, unknown>) {
    return this.adminService.createResource('halls', payload);
  }

  @Get('halls')
  listHalls() {
    return this.adminService.listResource('halls');
  }

  @Patch('halls/:id')
  updateHall(
    @Param('id') id: string,
    @Body() payload: Record<string, unknown>,
  ) {
    return this.adminService.updateResource('halls', id, payload);
  }

  @Delete('halls/:id')
  deleteHall(@Param('id') id: string) {
    return this.adminService.deleteResource('halls', id);
  }

  @Post('events')
  createEvent(@Body() payload: Record<string, unknown>) {
    return this.adminService.createResource('events', payload);
  }

  @Get('events')
  listEvents() {
    return this.adminService.listResource('events');
  }

  @Patch('events/:id')
  updateEvent(
    @Param('id') id: string,
    @Body() payload: Record<string, unknown>,
  ) {
    return this.adminService.updateResource('events', id, payload);
  }

  @Delete('events/:id')
  deleteEvent(@Param('id') id: string) {
    return this.adminService.deleteResource('events', id);
  }

  @Post('producers')
  createProducer(@Body() payload: Record<string, unknown>) {
    return this.adminService.createResource('producers', payload);
  }

  @Get('producers')
  listProducers() {
    return this.adminService.listResource('producers');
  }

  @Patch('producers/:id')
  updateProducer(
    @Param('id') id: string,
    @Body() payload: Record<string, unknown>,
  ) {
    return this.adminService.updateResource('producers', id, payload);
  }

  @Delete('producers/:id')
  deleteProducer(@Param('id') id: string) {
    return this.adminService.deleteResource('producers', id);
  }

  @Post('notifications/hall/:hallId')
  sendHallNotification(
    @Param('hallId') hallId: string,
    @Body('title') title: string,
    @Body('body') body: string,
    @Body('type') type: string,
  ) {
    return this.adminService.sendHallNotification(hallId, title, body, type);
  }

  @Post('notifications/global')
  sendGlobalNotification(
    @Body('title') title: string,
    @Body('body') body: string,
    @Body('type') type: string,
  ) {
    return this.adminService.sendGlobalNotification(title, body, type);
  }

  @Get('customers')
  listCustomers() {
    return this.adminService.listCustomers();
  }

  @Get('customers/:id/loyalty')
  getCustomerLoyalty(@Param('id') id: string) {
    return this.adminService.getCustomerLoyalty(id);
  }
}
