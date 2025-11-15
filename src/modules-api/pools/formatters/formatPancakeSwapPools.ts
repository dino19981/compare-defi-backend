import {
  PancakeSwapPoolDto,
  PancakeSwapTokenDto,
  PancakeSwapPoolTokenConfigs,
} from '@modules/pancakeSwap/types';
import { PoolItem, PoolPlatform } from '../types';
import { Chain } from 'src/shared/modules/chains';
import { keyBy } from 'lodash';
import { pancakeSwapChainNameById } from '@modules/pancakeSwap/constants/hardcodedImages';
import { findFirstAvailableImageUrl } from 'src/shared/helpers/checkImageUrl';
import { DEFAULT_POOL_TOKEN_IMAGE } from '../constants';
import { v4 as uuidv4 } from 'uuid';

// Функция для разбиения массива на батчи
function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

// Функция для задержки между батчами
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Функция для получения изображений токенов батчами
async function getTokenImagesInBatches(
  items: PancakeSwapPoolDto[],
  tokenBySymbol: Record<string, PancakeSwapTokenDto>,
  tokenConfigs: PancakeSwapPoolTokenConfigs,
): Promise<{ symbol: string; imageUrl: string }[]> {
  const tokensMap = {};
  const uniqueTokens: Array<{
    token: PancakeSwapPoolDto['token0'] | PancakeSwapPoolDto['token1'];
    chainId: number;
  }> = [];

  // Собираем уникальные токены
  items.forEach((item) => {
    if (!tokensMap[item.token0.symbol.toLowerCase()]) {
      tokensMap[item.token0.symbol.toLowerCase()] = true;
      uniqueTokens.push({ token: item.token0, chainId: item.chainId });
    }
    if (!tokensMap[item.token1.symbol.toLowerCase()]) {
      tokensMap[item.token1.symbol.toLowerCase()] = true;
      uniqueTokens.push({ token: item.token1, chainId: item.chainId });
    }
  });

  // Разбиваем токены на батчи по 40 запросов
  const tokenBatches = chunkArray(uniqueTokens, 40);
  const imageUrls: { symbol: string; imageUrl: string }[] = [];

  // Обрабатываем каждый батч последовательно
  for (let i = 0; i < tokenBatches.length; i++) {
    console.log(
      `Обрабатываем батч ${i + 1} из ${tokenBatches.length}, запросов: ${tokenBatches[i].length}`,
    );

    // Делаем запросы для всех токенов в текущем батче
    const batchPromises = tokenBatches[i].map(({ token, chainId }) =>
      getTokenImageUrl(tokenBySymbol, token, chainId, tokenConfigs),
    );

    const batchResults = await Promise.all(batchPromises);
    imageUrls.push(...batchResults);

    // Добавляем задержку между батчами (кроме последнего)
    if (i < tokenBatches.length - 1) {
      console.log('Ожидание 1 секунду перед следующим батчем...');
      await delay(1000);
    }
  }

  return imageUrls;
}

export async function formatPancakeSwapPools(
  items: PancakeSwapPoolDto[],
  chains: Record<number, Chain>,
  tokens: PancakeSwapTokenDto[],
  tokenConfigs: PancakeSwapPoolTokenConfigs,
): Promise<PoolItem[]> {
  const tokenBySymbol = keyBy(tokens, 'symbol');

  const tokenImageBySymbol = {};

  // Получаем изображения токенов батчами
  const imageUrls = await getTokenImagesInBatches(
    items,
    tokenBySymbol,
    tokenConfigs,
  );

  let bad = 0;

  imageUrls.forEach((imageUrl) => {
    if (imageUrl.imageUrl === DEFAULT_POOL_TOKEN_IMAGE) {
      bad++;
    }

    tokenImageBySymbol[imageUrl.symbol.toLowerCase()] = imageUrl.imageUrl;
  });

  console.log(
    bad,
    Object.keys(tokenImageBySymbol).length,
    tokenImageBySymbol,
    'tokenImageBySymboltokenImageBySymboltokenImageBySymboltokenImageBySymbol',
  );

  return items.reduce((acc: PoolItem[], item) => {
    const chain = chains[item.chainId] || {
      name: 'Unknown',
      image: {
        small: `https://assets.pancakeswap.finance/web/chains/square/${item.chainId}.svg`,
      },
    };

    if (!item?.token0?.symbol || !item?.token1?.symbol) {
      return acc;
    }

    if (!chains[item.chainId]) {
      console.log(item.chainId, ' not found for pancakeswap');
    }

    const firstTokenImage =
      tokenImageBySymbol[item.token0.symbol.toLowerCase()];
    const secondTokenImage =
      tokenImageBySymbol[item.token1.symbol.toLowerCase()];

    acc.push({
      id: uuidv4(),

      firstToken: {
        name: item.token0.symbol,
        imageUrl: firstTokenImage,
      },
      secondToken: {
        name: item.token1.symbol,
        imageUrl: secondTokenImage,
      },
      platform: {
        name: PoolPlatform.PancakeSwap,
        link: `https://pancakeswap.finance/liquidity/pool/${chainNameById[item.chainId]}/${item.id}`,
      },

      chain: {
        name: chain.name,
        imageUrl: chain.image.small,
      },

      tvl: +item.tvlUSD,
      volume: +item.volumeUSD24h,
      fee: +item.feeTier / 10_000,

      apr: +item.apr24h * 100,

      badges: [],
    });

    return acc;
  }, []);
}

// /worker-chunks
const chainNameById = {
  1: 'eth',
  5: 'goerli',
  56: 'bsc',
  97: 'bscTestnet',
  42161: 'arb',
  421613: 'arbGoerli',
  1101: 'polygonZkEVM',
  1442: 'polygonZkEVMTestnet',
  324: 'zkSync',
  280: 'zkSyncTestnet',
  59144: 'linea',
  59140: 'lineaTestnet',
  204: 'opBNB',
  5611: 'opBnbTestnet',
  8453: 'base',
  84531: 'baseTestnet',
  534351: 'scrollSepolia',
  0xaa36a7: 'sepolia',
  421614: 'arbSepolia',
  84532: 'baseSepolia',
  10143: 'monadTestnet',
  0x1dcd653e9: 'sol',
  8000002e3: 'aptos',
};

// todo: Дописать функцию для получения изображения токена. У каждой сети есть хардкодные изображения токенов
// их можно найти в https://pancakeswap.finance/_next/static/chunks/worker-chunks.987ab401d51c696b.js
// поиск dmt: "0x8B0E6f19Ee57089F7649A455D89D7bC6314D04e8",18,"DMT","DMT","https://sankodreammachine.net/"),
async function getTokenImageUrl(
  tokenBySymbol: Record<string, PancakeSwapTokenDto>,
  token: PancakeSwapPoolDto['token0'] | PancakeSwapPoolDto['token1'],
  chainId: number,
  tokenConfigs: PancakeSwapPoolTokenConfigs,
) {
  const tokenData = tokenBySymbol[token.symbol];

  if (tokenData) {
    return {
      symbol: token.symbol,
      imageUrl: tokenData.logoURI,
    };
  }

  const images = [
    `https://tokens.pancakeswap.finance/images/symbol/${token.symbol.toLowerCase()}.png`,
  ];

  const tokenFromConfig = tokenConfigs[token.symbol.toLowerCase()];

  if (tokenFromConfig) {
    images.push(
      `https://tokens.pancakeswap.finance/images/${pancakeSwapChainNameById[tokenFromConfig.chainId]}/${tokenFromConfig.address}.png`,
      `https://tokens.pancakeswap.finance/images/${tokenFromConfig.address}.png`,
    );
  }

  const firstAvailableImageUrl = await findFirstAvailableImageUrl(images);

  return {
    symbol: token.symbol,
    imageUrl: firstAvailableImageUrl || DEFAULT_POOL_TOKEN_IMAGE,
  };
}
