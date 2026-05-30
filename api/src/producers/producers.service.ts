import { Injectable } from '@nestjs/common';

@Injectable()
export class ProducersService {
  create(payload: Record<string, unknown>) {
    return { id: 'producer-scaffold-id', ...payload };
  }

  findAll() {
    return [];
  }

  findOne(id: string) {
    return { id };
  }

  update(id: string, payload: Record<string, unknown>) {
    return { id, ...payload };
  }

  remove(id: string) {
    return { id, deleted: true };
  }
}
