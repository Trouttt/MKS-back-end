import * as bcrypt from 'bcrypt';

import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { AUTH_ERRORS } from 'src/shared/helpers/responses/errors/auth-errors.helpers';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { USER_ERRORS } from 'src/shared/helpers/responses/errors/user-errors.helpers';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,

    private jwtService: JwtService,
  ) { }

  @UseGuards(AuthGuard('local'))
  @Post('auth/login')
  async signIn(user: CreateUserDto, id: string) {
    const verifyIfUserIsValid = await this.validateUser(
      user.username,
      user.password,
    );

    if (verifyIfUserIsValid) {
      const payload = { username: user.username, sub: id };
      return {
        access_token: this.jwtService.sign(payload),
      };
    }
    throw new BadRequestException(AUTH_ERRORS.userDoesntExist);
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findOneByUsername(username);

    if (!user) {
      throw new BadRequestException(AUTH_ERRORS.userDoesntExist);
    }

    const verifiedPassword = await bcrypt.compare(password, user.password);

    if (!user || !verifiedPassword) {
      throw new BadRequestException(AUTH_ERRORS.userDoesntExist);
    }
    const { password: passwordd, ...result } = user;
    return result;
  }
}
