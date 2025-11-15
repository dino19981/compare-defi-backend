import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { firstValueFrom } from 'rxjs';
import {
  HtxEarnDto,
  HtxEarnsDto,
  HtxEarnType,
  HtxNewUsersEarnsDto,
} from './types';
import { getEarnError } from 'src/helpers/earn';

@Injectable()
export class HtxService {
  private baseUrl: string = 'https://www.htx.com';
  private readonly httpService: HttpService;
  private readonly logger = new Logger(HtxService.name);

  constructor() {
    this.httpService = new HttpService(
      axios.create({
        baseURL: this.baseUrl,
        timeout: 5000,
        responseType: 'json',
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }),
    );
  }

  async getEarnItems() {
    try {
      const [recommendedProjects, newUsersProjects] = await Promise.all([
        this.getRecommendedEarnProjects(),
        this.getNewUsersEarnProjects(),
      ]);
      console.log(newUsersProjects.length, 'newUsersProjects');

      return [...recommendedProjects, ...newUsersProjects];
    } catch (error: unknown) {
      this.logger.error(getEarnError(error, 'htx'));
      return [];
    }
  }

  private async getRecommendedEarnProjects() {
    try {
      const url = `/-/x/hbg/v4/saving/mining/home?r=n3x9tg&x-b3-traceid=07d0c6cae296c2907a67dc05c88c84db`;

      const response = await firstValueFrom(
        this.httpService.get<HtxEarnsDto>(url),
      );

      return response.data.data.recommendProject.map((item) => ({
        ...item,
        type: HtxEarnType.Recommended,
      }));
    } catch (error: unknown) {
      this.logger.error(getEarnError(error, 'htx'));
      return [];
    }
  }

  private async getNewUsersEarnProjects(): Promise<HtxEarnDto[]> {
    try {
      const url = `/-/x/hbg/v4/saving/mining/project/queryNewUserList?page=1&holdCurrency=0&r=l499lv`;

      const response = await firstValueFrom(
        this.httpService.get<HtxNewUsersEarnsDto>(url),
      );

      return response.data.data.map((item) => ({
        currency: item.currency,
        icon: item.icon,
        projectList: [item],
        type: HtxEarnType.NewUsers,
      }));
    } catch (error: unknown) {
      this.logger.error(getEarnError(error, 'htx'));
      return [];
    }
  }
}
