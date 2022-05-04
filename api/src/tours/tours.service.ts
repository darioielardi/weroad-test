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
    if (input.startingDate >= input.endingDate) {
      throw new BadRequestException('Invalid dates');
    }

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

  update(id: number, input: UpdateTourInput) {
    return `This action updates a #${id} tour`;
  }

  remove(id: number) {
    return `This action removes a #${id} tour`;
  }
}
