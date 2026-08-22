import { EVENEMENTS, Evenement } from '../data/evenements';

export const eventsService = {
  getAll(): Evenement[] {
    return EVENEMENTS;
  },

  getById(id: string): Evenement | undefined {
    return EVENEMENTS.find((event) => event.id === id);
  },

  getByHalleId(halleId: string): Evenement[] {
    return EVENEMENTS.filter((event) => event.halleId === halleId);
  },
};