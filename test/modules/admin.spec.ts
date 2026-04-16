import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from '../../src/services/admin.service';
import { AdminUserRepository } from '../../src/repositories/admin-user.repository';
import { AdminInvitationRepository } from '../../src/repositories/admin-invitation.repository';
import { mockUser, mockInvitation } from '../configs/constant';

const mockUserRepo = {
    findAll: jest.fn(),
    delete: jest.fn(),
    count: jest.fn()
};

const mockInvitationRepo = {
    findAll: jest.fn(),
    count: jest.fn(),
    countByStatus: jest.fn()
};

describe('AdminService', () => {
    let service: AdminService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AdminService, { provide: AdminUserRepository, useValue: mockUserRepo }, { provide: AdminInvitationRepository, useValue: mockInvitationRepo }]
        }).compile();

        service = module.get<AdminService>(AdminService);
        jest.clearAllMocks();
    });

    describe('getUsers', () => {
        it('should return all users', async () => {
            mockUserRepo.findAll.mockResolvedValue([mockUser]);

            const result = await service.getUsers();
            expect(result).toHaveLength(1);
            expect(result[0].email).toBe('mubarok@test.com');
        });
    });

    describe('deleteUser', () => {
        it('should delete user by id', async () => {
            mockUserRepo.delete.mockResolvedValue(undefined);

            await expect(service.deleteUser('user-uuid-1')).resolves.not.toThrow();
            expect(mockUserRepo.delete).toHaveBeenCalledWith('user-uuid-1');
        });
    });

    describe('getInvitations', () => {
        it('should return all invitations', async () => {
            mockInvitationRepo.findAll.mockResolvedValue([mockInvitation]);

            const result = await service.getInvitations();
            expect(result).toHaveLength(1);
        });
    });

    describe('getDashboard', () => {
        it('should return dashboard stats', async () => {
            mockUserRepo.count.mockResolvedValue(5);
            mockInvitationRepo.count.mockResolvedValue(10);
            mockInvitationRepo.countByStatus.mockResolvedValueOnce(7).mockResolvedValueOnce(3);

            const result = await service.getDashboard();
            expect(result).toEqual({
                totalUsers: 5,
                totalInvitations: 10,
                published: 7,
                draft: 3
            });
        });

        it('should call countByStatus for published and draft', async () => {
            mockUserRepo.count.mockResolvedValue(0);
            mockInvitationRepo.count.mockResolvedValue(0);
            mockInvitationRepo.countByStatus.mockResolvedValue(0);

            await service.getDashboard();
            expect(mockInvitationRepo.countByStatus).toHaveBeenCalledWith('published');
            expect(mockInvitationRepo.countByStatus).toHaveBeenCalledWith('draft');
        });
    });
});
