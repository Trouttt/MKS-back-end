import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { MOVIE_ERRORS } from 'src/shared/helpers/responses/errors/movie-errors.helpers';
import { MOVIE_SUCCESSFULS } from 'src/shared/helpers/responses/successfuls/movie-successfuls.helpers';
import { Repository } from 'typeorm';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entities/movie.entity';

@Injectable()
export class MoviesService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,

    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) { }

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const movie = this.movieRepository.create(createMovieDto);
    return this.movieRepository.save(movie);
  }
  async findAll(): Promise<Movie[] | unknown> {
    const cachedItem = await this.cacheManager.get('movies');

    if (cachedItem) {
      return cachedItem;
    } else {
      const movies = await this.movieRepository.find();
      await this.cacheManager.set('movies', { movies });
      return movies;
    }
  }

  async findOne(id: string): Promise<Movie> {
    return this.movieRepository.findOne({ where: { id } });
  }

  async update(id: string, updateMovieDto: UpdateMovieDto): Promise<Movie> {
    const movieToUpdate = await this.findOne(id);

    return this.movieRepository.save({ ...movieToUpdate, updateMovieDto });
  }

  async remove(id: string): Promise<{ message: string }> {
    const movieToDelete = await this.findOne(id);

    if (!movieToDelete) {
      throw new NotFoundException(MOVIE_ERRORS.movieDoesntExiste);
    }

    await this.movieRepository.softRemove(movieToDelete);

    return { message: MOVIE_SUCCESSFULS.movieRemovedWithSuccessfull };
  }
}
