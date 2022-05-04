import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TravelsService } from '../travels/travels.service';
import { CreateTourInput } from './dto/create-tour.input';
import { UpdateTourInput } from './dto/update-tour.input';
import { Tour } from './entities/tour.entity';

@Injectable()
export class ToursService {
  constructor(
    @InjectRepository(Tour)
    private readonly tourRepo: EntityRepository<Tour>,
    private travelsService: TravelsService,
  ) {}

  async create(input: CreateTourInput) {
    // validate dates

    if (input.startingDate >= input.endingDate) {
      throw new BadRequestException('Invalid dates');
    }

    // validate name

    const existingByName = await this.tourRepo.findOne({
      name: input.name,
    });

    if (existingByName) {
      throw new ConflictException('A tour with this name already exists');
    }

    const travel = await this.travelsService.findOne(input.travelId);

    if (!travel) {
      throw new NotFoundException(`Travel with id ${input.travelId} not found`);
    }

    // create and save

    const tour = this.tourRepo.create(input);
    tour.travel = travel;

    await this.tourRepo.persistAndFlush(tour);

    return tour;
  }

  async findAll(): Promise<Tour[]> {
    return [];
  }

  findOne(id: number) {
    return `This action returns a #${id} tour`;
  }

  async update(input: UpdateTourInput) {
    const tour = await this.tourRepo.findOne(input.id);

    if (!tour) {
      throw new NotFoundException(`Tour with id ${input.id} not found`);
    }

    // validate & set dates

    const finalStartingDate = input.startingDate || tour.startingDate;
    const finalEndingDate = input.endingDate || tour.endingDate;

    if (finalStartingDate >= finalEndingDate) {
      throw new BadRequestException('Invalid dates');
    }

    tour.startingDate = finalStartingDate;
    tour.endingDate = finalEndingDate;

    // validate & set name

    if (input.name) {
      const existingByName = await this.tourRepo.findOne({
        name: input.name,
        id: { $not: input.id },
      });

      if (existingByName) {
        throw new ConflictException('A tour with this name already exists');
      }

      tour.name = input.name;
    }

    // set price

    if (typeof input.price !== 'undefined') {
      tour.price = input.price;
    }

    // and finally save

    await this.tourRepo.persistAndFlush(tour);

    return tour;
  }

  remove(id: number) {
    return `This action removes a #${id} tour`;
  }
}
