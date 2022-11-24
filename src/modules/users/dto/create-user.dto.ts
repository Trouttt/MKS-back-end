import {
  IsNotEmpty,
  IsString,
  IsUUID,
  Matches,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateUserDto {
  @ApiProperty()
  @MinLength(3)
  @IsString()
  username: string;

  @ApiProperty()
  @MinLength(8)
  @IsString()
  @Matches(/[A-Z]/, {
    message: 'password needs a uppercase letter',
  })
  @Matches(/[0-9]/, {
    message: 'password needs a number',
  })
  password: string;
}
