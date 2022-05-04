import { getRepositoryToken } from '@mikro-orm/nestjs';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TravelsService } from '../travels/travels.service';
import { Tour } from './entities/tour.entity';
import { ToursService } from './tours.service';

const mockedRepo = {
  findOne: jest.fn(),
  create: jest.fn(),
  persistAndFlush: jest.fn(),
};

const mockedTravelsService = {
  findOne: jest.fn(),
};

describe('ToursService', () => {
  let service: ToursService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ToursService,
        { provide: getRepositoryToken(Tour), useValue: mockedRepo },
        { provide: TravelsService, useValue: mockedTravelsService },
      ],
    }).compile();

    service = module.get<ToursService>(ToursService);
  });

  describe('create tour', () => {
    test('invalid dates', async () => {
      await expect(
        service.create({
          travelId: 'abc123',
          name: 'test',
          startingDate: new Date('2030-02-01'),
          endingDate: new Date('2030-01-01'),
          price: 1000,
        }),
      ).rejects.toThrow('Invalid dates');
    });

    test('existing by name', async () => {
      const alreadyExistingName = 'existing-name';

      mockedRepo.findOne.mockImplementationOnce((params: { name: string }) => {
        if (params.name === alreadyExistingName) {
          return new Tour();
        }
      });

      await expect(
        service.create({
          travelId: 'abc123',
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
});
