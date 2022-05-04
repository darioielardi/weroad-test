import { getRepositoryToken } from '@mikro-orm/nestjs';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Travel } from './entities/travel.entity';
import { TravelsService } from './travels.service';

const mockedRepo = {
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  persistAndFlush: jest.fn(),
  removeAndFlush: jest.fn(),
};

describe('TravelsService', () => {
  let service: TravelsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        TravelsService,
        { provide: getRepositoryToken(Travel), useValue: mockedRepo },
      ],
    }).compile();

    service = module.get<TravelsService>(TravelsService);
  });

  describe('find travels', () => {
    const travels = [
      { isPublic: true, id: '1' },
      { isPublic: false, id: '2' },
      { isPublic: true, id: '3' },
    ];

    beforeEach(() => {
      mockedRepo.find.mockImplementationOnce(
        (where: { isPublic?: boolean }) => {
          if (where.isPublic) {
            return travels.filter((t) => t.isPublic === where.isPublic);
          }

          return travels;
        },
      );
    });

    test('should return all travels', async () => {
      const result = await service.findAll({});
      expect(result.length).toBe(3);
    });

    test('should return only public travels', async () => {
      const result = await service.findAll({ publicOnly: true });
      expect(result.length).toBe(2);
      expect(result.map((t) => t.id)).toEqual(['1', '3']);
    });
  });

  describe('create travel', () => {
    test('slug already exists', async () => {
      const alreadyExistingSlug = 'existing-slug';

      mockedRepo.findOne.mockImplementationOnce((params: { slug: string }) => {
        if (params.slug === alreadyExistingSlug) {
          return new Travel();
        }
      });

      await expect(
        service.create({
          name: 'test',
          slug: alreadyExistingSlug,
          description: 'test',
          numberOfDays: 1,
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('delete travel', () => {
    test('not found', async () => {
      mockedRepo.findOne.mockImplementationOnce(() => null);

      await expect(service.delete('abc123')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });
});
