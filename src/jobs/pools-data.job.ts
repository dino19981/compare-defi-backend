import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PoolsService } from '@modules-api/pools/pools.service';

@Injectable()
export class PoolsDataJob {
  private readonly logger = new Logger(PoolsDataJob.name);

  constructor(private readonly poolsService: PoolsService) {}

  @Cron(CronExpression.EVERY_4_HOURS)
  async saveEarnDataJob() {
    this.logger.log('Starting pools data collection job...');

    try {
      await this.poolsService.smartUpdatePoolItemsInDb();
      this.logger.log(`Pools data updated in db`);
    } catch (error) {
      this.logger.error('Error in pools data collection job:', error);
    }
  }
}
