import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  const authService = new AuthService(
    new JwtService({ secret: 'test-secret' }),
  );

  it('returns a JWT token on login', () => {
    const result = authService.login({
      email: 'user@biltoki.fr',
      password: 'password',
    });

    expect(result.accessToken).toEqual(expect.any(String));
    expect(result.accessToken.length).toBeGreaterThan(10);
  });
});
