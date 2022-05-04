import { Test, TestingModule } from '@nestjs/testing';
import { ToursResolver } from './tours.resolver';
import { ToursService } from './tours.service';

describe('ToursResolver', () => {
  let resolver: ToursResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ToursResolver, ToursService],
    }).compile();

    resolver = module.get<ToursResolver>(ToursResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
