import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EarnService } from '../modules-api/earn/earn.service';
import * as fs from 'fs';
import * as path from 'path';
import { EARN_DATA_FILE_NAME } from '@modules-api/earn/constants/localDataEarnPath';

@Injectable()
export class EarnDataJob {
  private readonly logger = new Logger(EarnDataJob.name);

  constructor(private readonly earnService: EarnService) {}

  @Cron(CronExpression.EVERY_12_HOURS)
  async saveEarnDataJob() {
    this.logger.log('Starting earn data collection job...');

    try {
      const earnData = await this.earnService.getEarnItemsJob();

      const dataDir = path.join(process.cwd(), 'data');

      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      const filePath = path.join(dataDir, EARN_DATA_FILE_NAME);

      const dataToSave = {
        totalItems: earnData.data.length,
        data: earnData.data,
      };

      await fs.promises.writeFile(filePath, JSON.stringify(dataToSave), 'utf8');

      this.logger.log(
        `Earn data saved to ${filePath}. Total items: ${earnData.data.length}`,
      );
    } catch (error) {
      this.logger.error('Error in earn data collection job:', error);
    }
  }
}
