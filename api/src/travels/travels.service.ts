import { EntityRepository, FilterQuery } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaginationArgs } from '../common/pagination.args';
import { CreateTravelInput } from './dto/create-travel.input';
import { PaginatedTravels } from './dto/list-travels.input';
import { UpdateTravelInput } from './dto/update-travel.input';
import { Travel } from './entities/travel.entity';

@Injectable()
export class TravelsService {
  constructor(
    @InjectRepository(Travel)
    private readonly travelRepo: EntityRepository<Travel>,
  ) {}

  async create(input: CreateTravelInput): Promise<Travel> {
    const existingBySlug = await this.travelRepo.findOne({
      slug: input.slug,
    });

    if (existingBySlug) {
      throw new ConflictException('slug-already-exists');
    }

    const travel = this.travelRepo.create(input);

    await this.travelRepo.persistAndFlush(travel);

    return travel;
  }

  async findAll(
    params: { publicOnly?: boolean } & PaginationArgs,
  ): Promise<PaginatedTravels> {
    const where: FilterQuery<Travel> = {};

    if (params.publicOnly) {
      where.isPublic = true;
    }

    const [items, count] = await this.travelRepo.findAndCount(where, {
      populate: ['tours'],
      ...params,
    });

    return {
      items,
      hasMore: count > params.offset + params.limit,
    };
  }

  findOne(id: string) {
    return this.travelRepo.findOne(id);
  }

  findBySlug(slug: string) {
    return this.travelRepo.findOne({ slug });
  }

  async update(id: string, input: UpdateTravelInput) {
    const travel = await this.travelRepo.findOne(id);

    if (!travel) {
      throw new NotFoundException(`travel-not-found`);
    }

    if (input.slug) {
      const existingBySlug = await this.travelRepo.findOne({
        slug: input.slug,
        id: { $ne: id },
      });

      if (existingBySlug) {
        throw new ConflictException('slug-already-exists');
      }

      travel.slug = input.slug;
    }

    travel.name = input.name || travel.name;
    travel.description = input.description || travel.description;
    travel.isPublic = input.isPublic ?? travel.isPublic;
    travel.numberOfDays = input.numberOfDays ?? travel.numberOfDays;
    travel.natureMood = input.natureMood ?? travel.natureMood;
    travel.relaxMood = input.relaxMood ?? travel.relaxMood;
    travel.historyMood = input.historyMood ?? travel.historyMood;
    travel.cultureMood = input.cultureMood ?? travel.cultureMood;
    travel.partyMood = input.partyMood ?? travel.partyMood;

    await this.travelRepo.persistAndFlush(travel);

    return travel;
  }

  async delete(id: string) {
    const travel = await this.travelRepo.findOne(id);

    if (!travel) {
      throw new NotFoundException(`travel-not-found`);
    }

    return this.travelRepo.removeAndFlush(travel);
  }
}
