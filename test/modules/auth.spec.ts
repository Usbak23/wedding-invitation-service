import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../../src/services/auth.service';
import { UserRepository } from '../../src/repositories/user.repository';
import { mockUser } from '../configs/constant';

const mockUserRepo = {
    findByEmail: jest.fn(),
    findById: jest.fn(),
    create: jest.fn()
};

describe('AuthService', () => {
    let service: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: UserRepository, useValue: mockUserRepo },
                {
                    provide: JwtService,
                    useValue: { sign: jest.fn().mockReturnValue('mock_token') }
                }
            ]
        }).compile();

        service = module.get<AuthService>(AuthService);
        jest.clearAllMocks();
    });

    describe('register', () => {
        it('should register and not return password', async () => {
            mockUserRepo.findByEmail.mockResolvedValue(null);
            mockUserRepo.create.mockResolvedValue(mockUser);

            const result = await service.register({
                name: 'Mubarok',
                email: 'mubarok@test.com',
                password: '123456'
            });
            expect(result).not.toHaveProperty('password');
            expect(result.email).toBe('mubarok@test.com');
        });

        it('should throw ConflictException if email exists', async () => {
            mockUserRepo.findByEmail.mockResolvedValue(mockUser);
            await expect(
                service.register({
                    name: 'Mubarok',
                    email: 'mubarok@test.com',
                    password: '123456'
                })
            ).rejects.toThrow(ConflictException);
        });
    });

    describe('login', () => {
        it('should throw UnauthorizedException if user not found', async () => {
            mockUserRepo.findByEmail.mockResolvedValue(null);
            await expect(service.login({ email: 'notfound@test.com', password: '123456' })).rejects.toThrow(UnauthorizedException);
        });

        it('should throw UnauthorizedException if password wrong', async () => {
            mockUserRepo.findByEmail.mockResolvedValue({
                ...mockUser,
                password: '$2b$10$invalid'
            });
            await expect(service.login({ email: 'mubarok@test.com', password: 'wrongpass' })).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('me', () => {
        it('should return user without password', async () => {
            mockUserRepo.findById.mockResolvedValue(mockUser);
            const result = await service.me('user-uuid-1');
            expect(result).not.toHaveProperty('password');
        });

        it('should throw UnauthorizedException if user not found', async () => {
            mockUserRepo.findById.mockResolvedValue(null);
            await expect(service.me('user-uuid-1')).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('logout', () => {
        it('should return logout message', () => {
            const result = service.logout();
            expect(result).toEqual({ message: 'Logout successful' });
        });
    });
});
