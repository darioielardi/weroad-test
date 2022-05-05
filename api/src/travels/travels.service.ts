import { EntityRepository, FilterQuery } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTravelInput } from './dto/create-travel.input';
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
      throw new ConflictException('A travel with this slug already exists');
    }

    const travel = this.travelRepo.create(input);

    await this.travelRepo.persistAndFlush(travel);

    return travel;
  }

  findAll(params: { publicOnly?: boolean }) {
    const where: FilterQuery<Travel> = {};

    if (params.publicOnly) {
      where.isPublic = true;
    }

    return this.travelRepo.find(where, {
      populate: ['tours'],
    });
  }

  findOne(id: string) {
    return this.travelRepo.findOne(id);
  }

  findBySlug(slug: string) {
    return this.travelRepo.findOne({ slug });
  }

  update(id: string, input: UpdateTravelInput) {
    // TODO: if isPublic check stuff

    return `This action updates a #${id} travel`;
  }

  async delete(id: string) {
    const travel = await this.travelRepo.findOne(id);

    if (!travel) {
      throw new NotFoundException(`Travel with id ${id} not found`);
    }

    return this.travelRepo.removeAndFlush(travel);
  }
}
