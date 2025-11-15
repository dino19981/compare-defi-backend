import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SeoDocument, SeoEntity } from './seo.entity';
import { SeoResponseDto } from './dtos/seo.dto';
import { SeoRequestDto } from './dtos/seoRequest.dto';

@Injectable()
export class SeoRepository {
  constructor(
    @InjectModel(SeoEntity.name)
    private readonly seoModel: Model<SeoDocument>,
  ) {}

  async find({ pathname, language }: SeoRequestDto): Promise<SeoResponseDto> {
    const data = await this.seoModel
      .findOne({
        pathname,
      })
      .lean()
      .exec();

    console.log('seoseoseosoea', data?.data?.[language], pathname, language);

    if (!data || !data.data[language]) {
      throw new NotFoundException(
        `SEO not found for pathname: ${pathname} and language: ${language}`,
      );
    }

    return {
      pathname,
      data: data.data[language],
    };
  }
}
