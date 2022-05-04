import { Injectable } from '@nestjs/common';
import { CreateTourInput } from './dto/create-tour.input';
import { UpdateTourInput } from './dto/update-tour.input';

@Injectable()
export class ToursService {
  create(createTourInput: CreateTourInput) {
    return 'This action adds a new tour';
  }

  findAll() {
    return `This action returns all tours`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tour`;
  }

  update(id: number, updateTourInput: UpdateTourInput) {
    return `This action updates a #${id} tour`;
  }

  remove(id: number) {
    return `This action removes a #${id} tour`;
  }
}
