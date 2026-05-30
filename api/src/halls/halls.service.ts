import { Injectable } from '@nestjs/common';

const HALLS = [
  {
    id: 'biltoki-bordeaux',
    name: 'Biltoki Bordeaux',
    city: 'Bordeaux',
    address: 'Quai des Chartrons, 33000 Bordeaux',
    openingHours: 'Mon-Sun 09:00-22:00',
  },
  {
    id: 'biltoki-anglet',
    name: 'Biltoki Anglet',
    city: 'Anglet',
    address: '1 Avenue de Bayonne, 64600 Anglet',
    openingHours: 'Tue-Sun 10:00-23:00',
  },
];

@Injectable()
export class HallsService {
  findAll() {
    return HALLS;
  }

  findOne(id: string) {
    return HALLS.find((hall) => hall.id === id) ?? null;
  }
}
