import { Injectable } from '@nestjs/common';

const EVENTS = [
  {
    id: 'event-tasting-bordeaux',
    hallId: 'biltoki-bordeaux',
    title: 'Atelier dégustation fromages',
    description: 'Découverte de producteurs locaux et accords vins/fromages.',
    location: 'Salle animation',
    startsAt: '2026-06-15T18:00:00.000Z',
  },
];

@Injectable()
export class EventsService {
  findAll(hallId?: string) {
    if (!hallId) {
      return EVENTS;
    }

    return EVENTS.filter((event) => event.hallId === hallId);
  }

  findOne(id: string) {
    return EVENTS.find((event) => event.id === id) ?? null;
  }

  markInterested(eventId: string, userId: string) {
    return {
      eventId,
      userId,
      reminderScheduled: true,
    };
  }
}
