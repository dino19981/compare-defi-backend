import { Injectable, Logger } from '@nestjs/common';
import { getPoolsError } from 'src/helpers/pools';
import { AaveClient, chainId } from '@aave/client';
import { markets } from '@aave/client/actions';

@Injectable()
export class AaveService {
  private readonly logger = new Logger(AaveService.name);
  private readonly client: AaveClient;

  constructor() {
    this.client = AaveClient.create();
  }

  async getLendingItems() {
    const result = await markets(this.client, {
      chainIds: [
        chainId(1),
        chainId(8453),
        chainId(42161),
        chainId(43114),
        chainId(146),
        chainId(10),
        chainId(137),
        chainId(56),
        chainId(42220),
        chainId(100),
        chainId(534352),
        chainId(324),
        chainId(1868),
        chainId(59144),
      ],
    });

    if (result.isErr()) {
      this.logger.error(getPoolsError(result.error, 'aave'));
      return [];
    }

    return result.value;
  }
}
