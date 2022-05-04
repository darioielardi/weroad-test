import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TravelsService } from '../travels/travels.service';
import { Tour } from './entities/tour.entity';
import { ToursService } from './tours.service';

const getMockedRepo = () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  persistAndFlush: jest.fn(),
});

const mockedTravelsService = {
  findOne: jest.fn(),
};

describe('ToursService', () => {
  let service: ToursService;
  let mockedRepo: ReturnType<typeof getMockedRepo>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ToursService,
        { provide: getRepositoryToken(Tour), useValue: getMockedRepo() },
        { provide: TravelsService, useValue: mockedTravelsService },
      ],
    }).compile();

    service = module.get<ToursService>(ToursService);
    mockedRepo = module.get<ReturnType<typeof getMockedRepo>>(
      getRepositoryToken(Tour),
    );
  });

  describe('create tour', () => {
    test('invalid dates', async () => {
      await expect(
        service.create({
          travelId: faker.datatype.uuid(),
          name: 'test',
          startingDate: new Date('2030-02-01'),
          endingDate: new Date('2030-01-01'),
          price: 1000,
        }),
      ).rejects.toThrow('Invalid dates');
    });

    test('name already exists', async () => {
      const alreadyExistingName = 'existing-name';

      mockedRepo.findOne.mockImplementationOnce((params: { name: string }) => {
        if (params.name === alreadyExistingName) {
          return new Tour();
        }
      });

      await expect(
        service.create({
          travelId: faker.datatype.uuid(),
          name: alreadyExistingName,
          startingDate: new Date('2030-02-01'),
          endingDate: new Date('2030-03-01'),
          price: 1000,
        }),
      ).rejects.toThrow(ConflictException);
    });

    test('travel not found', async () => {
      mockedTravelsService.findOne.mockImplementationOnce(() => null);

      await expect(
        service.create({
          travelId: 'abc123',
          name: 'test',
          startingDate: new Date('2030-02-01'),
          endingDate: new Date('2030-03-01'),
          price: 1000,
        }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('update tour', () => {
    test('not found', async () => {
      mockedRepo.findOne.mockImplementationOnce(() => null);

      await expect(
        service.update({
          id: faker.datatype.uuid(),
          name: 'test',
          startingDate: new Date('2030-02-01'),
          endingDate: new Date('2030-03-01'),
          price: 1000,
        }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    test('invalid dates', async () => {
      mockedRepo.findOne.mockImplementationOnce(() => new Tour());

      await expect(
        service.update({
          id: faker.datatype.uuid(),
          name: 'test',
          startingDate: new Date('2030-03-01'),
          endingDate: new Date('2030-02-01'),
        }),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    test('name already exists', async () => {
      const alreadyExistingName = 'existing-name';

      mockedRepo.findOne.mockImplementation(
        (params: string | { name: string }) => {
          if (typeof params === 'string') {
            return new Tour();
          }

          if (params.name === alreadyExistingName) {
            return new Tour();
          }
        },
      );

      await expect(
        service.update({
          id: faker.datatype.uuid(),
          name: alreadyExistingName,
          startingDate: new Date('2030-02-01'),
          endingDate: new Date('2030-03-01'),
          price: 1000,
        }),
      ).rejects.toThrow(ConflictException);
    });
  });
});
