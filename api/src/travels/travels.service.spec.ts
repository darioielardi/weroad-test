import { getRepositoryToken } from '@mikro-orm/nestjs';
import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Travel } from './entities/travel.entity';
import { TravelsService } from './travels.service';

const mockedRepo = {
  findOne: jest.fn(),
  create: jest.fn(),
  persistAndFlush: jest.fn(),
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

  describe('create travel', () => {
    test('existing by slug', async () => {
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
});
