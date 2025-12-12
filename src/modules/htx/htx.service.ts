import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { firstValueFrom } from 'rxjs';
import {
  HtxEarnDto,
  HtxEarnsDto,
  HtxEarnType,
  HtxNewUserEarnDto,
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
      const [
        recommendedProjects,
        // newUsersProjects,
        flexibleProjects,
        fixedProjects,
        limitListProjects,
      ] = await Promise.all([
        this.getRecommendedEarnProjects(),
        // this.getNewUsersEarnProjects(),
        this.getFlexibleEarnProjects(),
        this.getFixedEarnProjects(),
        this.getLimitListEarnProjects(),
      ]);

      return [
        ...recommendedProjects,
        ...flexibleProjects,
        ...fixedProjects,
        ...limitListProjects,
      ];
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

  private async getFlexibleEarnProjects(): Promise<HtxEarnDto[]> {
    try {
      const url = `/-/x/hbg/v4/saving/mining/project/queryYbbList?holdCurrency=0&r=ccemy`;

      const pagesCount = 27;

      const promisesResult = await Promise.allSettled(
        Array.from({ length: pagesCount }).map(async (item, idx) =>
          firstValueFrom(
            this.httpService.get<HtxNewUsersEarnsDto>(`${url}&page=${idx + 1}`),
          ),
        ),
      );

      const result = promisesResult.reduce((acc: HtxNewUserEarnDto[], res) => {
        if (res.status === 'fulfilled') {
          acc.push(...res.value.data.data);
        }
        return acc;
      }, []);

      return result.map((item) => ({
        currency: item.currency,
        icon: item.icon,
        projectList: [item],
        type: HtxEarnType.Flexible,
      }));
    } catch (error: unknown) {
      this.logger.error(getEarnError(error, 'htx flexible projects'));

      return [];
    }
  }

  private async getFixedEarnProjects(): Promise<HtxEarnDto[]> {
    try {
      const url = `/-/x/hbg/v4/saving/mining/project/queryFixedList?holdCurrency=0&r=r5mmys`;

      const pagesCount = 3;

      const promisesResult = await Promise.allSettled(
        Array.from({ length: pagesCount }).map(async (item, idx) =>
          firstValueFrom(
            this.httpService.get<HtxNewUsersEarnsDto>(`${url}&page=${idx + 1}`),
          ),
        ),
      );

      const result = promisesResult.reduce((acc: HtxNewUserEarnDto[], res) => {
        if (res.status === 'fulfilled') {
          acc.push(...res.value.data.data);
        }
        return acc;
      }, []);

      return result.map((item) => ({
        currency: item.currency,
        icon: item.icon,
        projectList: [item],
        type: HtxEarnType.Fixed,
      }));
    } catch (error: unknown) {
      this.logger.error(getEarnError(error, 'htx flexible projects'));

      return [];
    }
  }

  private async getLimitListEarnProjects(): Promise<HtxEarnDto[]> {
    try {
      const url = `/-/x/hbg/v4/saving/mining/project/queryLimitList?holdCurrency=0&r=ew2oxb`;

      const pagesCount = 2;

      const promisesResult = await Promise.allSettled(
        Array.from({ length: pagesCount }).map(async (item, idx) =>
          firstValueFrom(
            this.httpService.get<HtxNewUsersEarnsDto>(`${url}&page=${idx + 1}`),
          ),
        ),
      );

      const result = promisesResult.reduce((acc: HtxNewUserEarnDto[], res) => {
        if (res.status === 'fulfilled') {
          acc.push(...res.value.data.data);
        }
        return acc;
      }, []);

      return result.map((item) => ({
        currency: item.currency,
        icon: item.icon,
        projectList: [item],
        type: HtxEarnType.LimitList,
      }));
    } catch (error: unknown) {
      this.logger.error(getEarnError(error, 'htx flexible projects'));

      return [];
    }
  }

  /**
   * Я не понял откуда этот запрос, куда переводить пользователя для стейкинга?
   */
  // private async getNewUsersEarnProjects(): Promise<HtxEarnDto[]> {
  //   try {
  //     const url = `/-/x/hbg/v4/saving/mining/project/queryNewUserList?page=1&holdCurrency=0&r=l499lv`;

  //     const response = await firstValueFrom(
  //       this.httpService.get<HtxNewUsersEarnsDto>(url),
  //     );

  //     return response.data.data.map((item) => ({
  //       currency: item.currency,
  //       icon: item.icon,
  //       projectList: [item],
  //       type: HtxEarnType.NewUsers,
  //     }));
  //   } catch (error: unknown) {
  //     this.logger.error(getEarnError(error, 'htx'));
  //     return [];
  //   }
  // }
}
