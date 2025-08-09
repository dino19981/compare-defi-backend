import { Injectable, Logger } from '@nestjs/common';
import { JitoEarnDto } from './types/jitoEarnDto';
import { getEarnError } from 'src/helpers/earn';

@Injectable()
export class JitoService {
  private baseUrl: string = 'https://www.jito.network/api';
  private logger = new Logger(JitoService.name);

  constructor() {}

  async getApr(): Promise<{ name: string; apr: number }[]> {
    try {
      const jsonData = await fetch(
        'https://www.jito.network/api/getJitoPoolStats/',
        {
          headers: {
            accept: '*/*',
            'accept-language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
            baggage:
              'sentry-environment=vercel-production,sentry-release=2d6e1c01fdc99e86c8f70021d16bffe169f37a3d,sentry-public_key=26fad53235a060e5b341a33508fef59b,sentry-trace_id=d7b4fa30eb6c4800a59843ddb2fb37f0',
            'if-none-match': 'W/"gxrlz9d1545p2b"',
            priority: 'u=1, i',
            'sec-ch-ua':
              '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'sentry-trace': 'd7b4fa30eb6c4800a59843ddb2fb37f0-acd8cd7d095db5b6',
            cookie:
              '_ga=GA1.1.1749179546.1754123314; _ga_75MVXM8C0T=GS2.1.s1754126023$o2$g0$t1754126023$j60$l0$h0; ph_phc_UaPPGsSs51F8N9loDlZWYBpKqaToDizZ3vWfmYPUOSk_posthog=%7B%22distinct_id%22%3A%22019869e5-9e7c-7de1-87e4-20fd5de03aaf%22%2C%22%24sesid%22%3A%5B1754126024182%2C%2201986a0e-fc9c-7a0b-abdc-55b308bcfb6a%22%2C1754126023836%5D%2C%22%24initial_person_info%22%3A%7B%22r%22%3A%22%24direct%22%2C%22u%22%3A%22https%3A%2F%2Fwww.jito.network%2Fstats%2F%22%7D%7D',
            Referer: 'https://www.jito.network/staking/',
          },
          body: null,
          method: 'GET',
        },
      );

      const data = (await jsonData.json()) as JitoEarnDto;

      return [
        {
          name: 'SOL',
          apr: data.getStakePoolStats.apy.at(-1)!.data,
        },
      ];
    } catch (error) {
      this.logger.error(getEarnError(error, 'jito'));
      return [];
    }
  }
}
