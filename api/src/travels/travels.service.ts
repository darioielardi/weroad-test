import { Injectable } from '@nestjs/common';
import { CreateTravelInput } from './dto/create-travel.input';
import { UpdateTravelInput } from './dto/update-travel.input';

@Injectable()
export class TravelsService {
  create(createTravelInput: CreateTravelInput) {
    return 'This action adds a new travel';
  }

  findAll() {
    return `This action returns all travels`;
  }

  findOne(id: number) {
    return `This action returns a #${id} travel`;
  }

  update(id: number, updateTravelInput: UpdateTravelInput) {
    return `This action updates a #${id} travel`;
  }

  remove(id: number) {
    return `This action removes a #${id} travel`;
  }
}
