import { HallsService } from './halls.service';

describe('HallsService', () => {
  const hallsService = new HallsService();

  it('returns scaffolded halls', () => {
    const halls = hallsService.findAll();

    expect(halls.length).toBeGreaterThan(0);
    expect(halls[0]).toHaveProperty('id');
  });
});
