import { AuditService } from './audit.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user/user.service';

describe('AuditService', () => {
  let service: AuditService;

  const mockUserService = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditService,
        { provide: UserService, useValue: mockUserService },
      ],
    }).compile();

    service = module.get<AuditService>(AuditService);
    jest.clearAllMocks();
  });

  it('returns an entry when the user exists', () => {
    mockUserService.findById.mockReturnValue({ id: 1, name: 'Giorgi' });

    const result = service.record(1, 'login');

    expect(result).toEqual({ success: true, entry: 'Giorgi performed "login"' });
    expect(mockUserService.findById).toHaveBeenCalledWith(1);
    expect(mockUserService.findById).toHaveBeenCalledTimes(1);
  });

  it('returns a failure when the user does not exist', () => {
    mockUserService.findById.mockReturnValue(undefined);

    const result = service.record(99, 'login');

    expect(result).toEqual({ success: false, message: 'User 99 not found' });
  });
});