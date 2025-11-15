import { Injectable, Logger } from '@nestjs/common';
import { SeoRepository } from './seo.repository';
import { SeoResponseDto } from './dtos/seo.dto';
import { SeoRequestDto } from './dtos/seoRequest.dto';

@Injectable()
export class SeoService {
  private readonly logger = new Logger(SeoService.name);

  constructor(private readonly seoRepository: SeoRepository) {}

  async getSeo(query: SeoRequestDto): Promise<SeoResponseDto> {
    try {
      const data = await this.seoRepository.find(query);

      return data;
    } catch (error) {
      this.logger.error('Error fetching SEO:', error);

      throw error;
    }
  }
}
