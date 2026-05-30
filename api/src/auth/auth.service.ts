import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface SignUpDto {
  email: string;
  password: string;
  name: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  signup(payload: SignUpDto) {
    return {
      user: {
        id: 'scaffold-user-id',
        email: payload.email,
        name: payload.name,
      },
      accessToken: this.jwtService.sign({
        sub: 'scaffold-user-id',
        email: payload.email,
      }),
    };
  }

  login(payload: LoginDto) {
    return {
      accessToken: this.jwtService.sign({
        sub: 'scaffold-user-id',
        email: payload.email,
      }),
    };
  }
}
