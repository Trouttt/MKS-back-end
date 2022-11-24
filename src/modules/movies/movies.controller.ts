import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  CacheKey,
  CacheTTL,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Movie } from './entities/movie.entity';

@ApiTags('Movies')
@ApiBadRequestResponse({ description: 'Bad Request' })
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiForbiddenResponse({ description: 'Forbidden' })
@ApiUnprocessableEntityResponse({ description: 'Unprocessable Entity' })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
@UseGuards(JwtAuthGuard)
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) { }

  @ApiOperation({
    summary: 'create content',
    description: 'Create Content endpoint. Create a new content',
  })
  @ApiCreatedResponse({ description: 'Created', type: Movie })
  @ApiBearerAuth('jwt-token')
  @Post()
  create(@Body() createMovieDto: CreateMovieDto): Promise<Movie> {
    return this.moviesService.create(createMovieDto);
  }

  @ApiOperation({
    summary: 'This endpoint will return all movies',
  })
  @ApiOkResponse({
    description: 'all movies was found',
    type: Movie,
  })
  @ApiBearerAuth('jwt-token')
  @Get()
  @CacheKey('get_movie')
  @CacheTTL(60)
  findAll(): Promise<Movie[] | unknown> {
    return this.moviesService.findAll();
  }

  @ApiOperation({
    summary: 'This endpoint will return one movie',
  })
  @ApiOkResponse({
    description: 'a movie was found',
    type: Movie,
  })
  @ApiBearerAuth('jwt-token')
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Movie> {
    return this.moviesService.findOne(id);
  }

  @ApiOperation({
    summary: 'This endpoint will update a movie',
  })
  @ApiOkResponse({
    description: 'a movie was updated',
    type: Movie,
  })
  @ApiBearerAuth('jwt-token')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMovieDto: UpdateMovieDto,
  ): Promise<Movie> {
    return this.moviesService.update(id, updateMovieDto);
  }

  @ApiOperation({
    summary: 'This endpoint will remove a movie',
  })
  @ApiOkResponse({
    description: 'a movie was removed',
    type: Movie,
  })
  @ApiBearerAuth('jwt-token')
  @Delete(':id')
  remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.moviesService.remove(id);
  }
}
