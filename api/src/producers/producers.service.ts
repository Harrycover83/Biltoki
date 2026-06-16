import { Injectable } from '@nestjs/common';

@Injectable()
export class ProducersService {
  create(_payload: Record<string, unknown>) {
    void _payload;
    return { id: 'producer-scaffold-id', created: true };
  }

  findAll() {
    return [];
  }

  findOne(id: string) {
    return { id };
  }

  update(id: string, _payload: Record<string, unknown>) {
    void _payload;
    return { id, updated: true };
  }

  remove(id: string) {
    return { id, deleted: true };
  }
}
