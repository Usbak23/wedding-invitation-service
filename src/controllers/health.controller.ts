import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DataSource } from 'typeorm';

@ApiTags('Health')
@Controller('api/health')
export class HealthController {
    constructor(private readonly dataSource: DataSource) {}

    @Get()
    async check() {
        const dbStatus = this.dataSource.isInitialized ? 'up' : 'down';
        let dbLatency = -1;

        if (this.dataSource.isInitialized) {
            const start = Date.now();
            await this.dataSource.query('SELECT 1');
            dbLatency = Date.now() - start;
        }

        const uptime = process.uptime();
        const memUsage = process.memoryUsage();

        return {
            status: dbStatus === 'up' ? 'healthy' : 'unhealthy',
            timestamp: new Date().toISOString(),
            uptime: Math.floor(uptime),
            services: {
                database: { status: dbStatus, latency_ms: dbLatency }
            },
            memory: {
                rss_mb: Math.round(memUsage.rss / 1024 / 1024),
                heap_used_mb: Math.round(memUsage.heapUsed / 1024 / 1024),
                heap_total_mb: Math.round(memUsage.heapTotal / 1024 / 1024)
            }
        };
    }
}
