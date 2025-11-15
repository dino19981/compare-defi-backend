import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TokensService } from '../shared/modules/tokens/tokens.service';

@Injectable()
export class TokensJob {
  private readonly logger = new Logger(TokensJob.name);

  constructor(private readonly tokensService: TokensService) {}

  @Cron(CronExpression.EVERY_WEEK)
  async saveTokensJob() {
    this.logger.log('Starting tokens collection job...');

    try {
      const tokensData = await this.tokensService.saveTokens();

      this.logger.log(
        `Tokens data saved to db. Total items: ${tokensData?.length}`,
      );
    } catch (error) {
      this.logger.error('Error in tokens collection job:', error);
    }
  }
}
