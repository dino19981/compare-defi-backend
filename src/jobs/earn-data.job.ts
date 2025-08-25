import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EarnService } from '../modules-api/earn/earn.service';

@Injectable()
export class EarnDataJob {
  private readonly logger = new Logger(EarnDataJob.name);

  constructor(private readonly earnService: EarnService) {}

  @Cron(CronExpression.EVERY_12_HOURS)
  async saveEarnDataJob() {
    this.logger.log('Starting earn data collection job...');

    try {
      const earnData = await this.earnService.saveEarnItemsInDb();

      this.logger.log(
        `Earn data saved to db. Total items: ${earnData.data.length}`,
      );
    } catch (error) {
      this.logger.error('Error in earn data collection job:', error);
    }
  }
}
