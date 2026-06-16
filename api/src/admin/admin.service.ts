import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminService {
  createResource(
    type: 'halls' | 'events' | 'producers',
    _payload: Record<string, unknown>,
  ) {
    void _payload;
    return { type, action: 'create' };
  }

  listResource(type: 'halls' | 'events' | 'producers') {
    return { type, action: 'list' };
  }

  updateResource(
    type: 'halls' | 'events' | 'producers',
    id: string,
    _payload: Record<string, unknown>,
  ) {
    void _payload;
    return { type, id, action: 'update' };
  }

  deleteResource(type: 'halls' | 'events' | 'producers', id: string) {
    return { type, id, action: 'delete' };
  }

  sendHallNotification(
    hallId: string,
    title: string,
    body: string,
    type: string,
  ) {
    return { hallId, title, body, type, action: 'notify-hall' };
  }

  sendGlobalNotification(title: string, body: string, type: string) {
    return { title, body, type, action: 'notify-global' };
  }

  listCustomers() {
    return [];
  }

  getCustomerLoyalty(customerId: string) {
    return { customerId, points: 0, tier: 'BRONZE' };
  }
}
