import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMovieDto {
  @ApiProperty({
    description: 'Movie name',
    example: 'Cidade de Deus',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
