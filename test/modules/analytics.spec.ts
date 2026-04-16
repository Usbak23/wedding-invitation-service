import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsService } from '../../src/services/analytics.service';
import { AnalyticRepository } from '../../src/repositories/analytic.repository';
import { mockReq } from '../configs/constant';

const mockAnalyticRepo = {
    create: jest.fn(),
    countByEvent: jest.fn()
};

describe('AnalyticsService', () => {
    let service: AnalyticsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AnalyticsService, { provide: AnalyticRepository, useValue: mockAnalyticRepo }]
        }).compile();

        service = module.get<AnalyticsService>(AnalyticsService);
        jest.clearAllMocks();
    });

    describe('track', () => {
        it('should track event with ip and user-agent', async () => {
            mockAnalyticRepo.create.mockResolvedValue(undefined);

            await service.track('inv-uuid-1', 'view', mockReq);
            expect(mockAnalyticRepo.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    event: 'view',
                    ip_address: '127.0.0.1',
                    user_agent: 'jest-test'
                })
            );
        });

        it('should track rsvp_open event', async () => {
            mockAnalyticRepo.create.mockResolvedValue(undefined);

            await service.track('inv-uuid-1', 'rsvp_open', mockReq);
            expect(mockAnalyticRepo.create).toHaveBeenCalledWith(expect.objectContaining({ event: 'rsvp_open' }));
        });
    });

    describe('getSummary', () => {
        it('should return summary with views, rsvp_opens, shares', async () => {
            mockAnalyticRepo.countByEvent.mockResolvedValueOnce(10).mockResolvedValueOnce(5).mockResolvedValueOnce(3);

            const result = await service.getSummary('inv-uuid-1');
            expect(result).toEqual({ views: 10, rsvp_opens: 5, shares: 3 });
        });

        it('should call countByEvent for each event type', async () => {
            mockAnalyticRepo.countByEvent.mockResolvedValue(0);

            await service.getSummary('inv-uuid-1');
            expect(mockAnalyticRepo.countByEvent).toHaveBeenCalledTimes(3);
            expect(mockAnalyticRepo.countByEvent).toHaveBeenCalledWith('inv-uuid-1', 'view');
            expect(mockAnalyticRepo.countByEvent).toHaveBeenCalledWith('inv-uuid-1', 'rsvp_open');
            expect(mockAnalyticRepo.countByEvent).toHaveBeenCalledWith('inv-uuid-1', 'share');
        });
    });
});
