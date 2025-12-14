import { SortDirection } from 'src/shared/types';

export const earnRoutes = [
  {
    alias: 'earn',
    path: '/earn',
    isShowPlatformFilter: true,
    isShowTokenFilter: true,
    sort: {
      field: 'positions.seo',
      direction: SortDirection.Asc,
    },
  },
  {
    alias: 'earn-stables',
    path: '/earn/stables',
    requestParams: {
      tokenName: [
        'USDT',
        'USDC',
        'USDS',
        'USDE',
        'DAI',
        'PYUSD',
        'USD1',
        'USDF',
        'USDD',
        'EURC',
        'EURA',
        'TUSD',
        'USDP',
        'USDG',
        'RLUSD',
        'USDTB',
        'BFUSD',
      ],
    },
    sort: {
      field: 'maxRate',
      direction: SortDirection.Desc,
    },
    isShowPlatformFilter: true,
    isShowTokenFilter: false,
  },
  {
    alias: 'earn-usdt',
    path: '/earn/usdt',
    sort: {
      field: 'maxRate',
      direction: SortDirection.Desc,
    },
    requestParams: {
      tokenName: ['USDT'],
    },
    isShowPlatformFilter: true,
    isShowTokenFilter: false,
  },
  {
    alias: 'earn-usdc',
    path: '/earn/usdc',
    sort: {
      field: 'maxRate',
      direction: SortDirection.Desc,
    },
    requestParams: {
      tokenName: ['USDC'],
    },
    isShowPlatformFilter: true,
    isShowTokenFilter: false,
  },
  {
    alias: 'earn-usds',
    path: '/earn/usds',
    sort: {
      field: 'maxRate',
      direction: SortDirection.Desc,
    },
    requestParams: {
      tokenName: ['USDS'],
    },
    isShowPlatformFilter: true,
    isShowTokenFilter: false,
  },
  {
    alias: 'earn-usde',
    path: '/earn/usde',
    sort: {
      field: 'maxRate',
      direction: SortDirection.Desc,
    },
    requestParams: {
      tokenName: ['USDE'],
    },
    isShowPlatformFilter: true,
    isShowTokenFilter: false,
  },
  {
    alias: 'earn-dai',
    path: '/earn/dai',
    sort: {
      field: 'maxRate',
      direction: SortDirection.Desc,
    },
    requestParams: {
      tokenName: ['DAI'],
    },
    isShowPlatformFilter: true,
    isShowTokenFilter: false,
  },
  {
    alias: 'earn-ethereum',
    path: '/earn/ethereum',
    sort: {
      field: 'maxRate',
      direction: SortDirection.Desc,
    },
    requestParams: {
      tokenName: [
        'ETH',
        'WETH',
        'STETH',
        'RSETH',
        'WSTETH',
        'rETH',
        'sETH',
        'reth',
        'WBETH',
        'WEETH',
      ],
    },
    isShowPlatformFilter: true,
    isShowTokenFilter: false,
  },
  {
    alias: 'earn-solana',
    path: '/earn/solana',
    sort: {
      field: 'maxRate',
      direction: SortDirection.Desc,
    },
    requestParams: {
      tokenName: ['SOL', 'WSOL', 'SSOL', 'STSOL'],
    },
    isShowPlatformFilter: true,
    isShowTokenFilter: false,
  },
  {
    alias: 'earn-polygon',
    path: '/earn/polygon',
    sort: {
      field: 'maxRate',
      direction: SortDirection.Desc,
    },
    requestParams: {
      tokenName: ['POL', 'WPOL', 'SPOL', 'STPOL'],
    },
    isShowPlatformFilter: true,
    isShowTokenFilter: false,
  },
  {
    alias: 'earn-bnb',
    path: '/earn/bnb',
    sort: {
      field: 'maxRate',
      direction: SortDirection.Desc,
    },
    requestParams: {
      tokenName: ['BNB', 'WBNB', 'SBNB', 'STBNB'],
    },
    isShowPlatformFilter: true,
    isShowTokenFilter: false,
  },
  {
    alias: 'earn-arbitrum',
    path: '/earn/arbitrum',
    sort: {
      field: 'maxRate',
      direction: SortDirection.Desc,
    },
    requestParams: {
      tokenName: ['ARB', 'WARB', 'SARB', 'STARB'],
    },
    isShowPlatformFilter: true,
    isShowTokenFilter: false,
  },
  {
    alias: 'earn-optimism',
    path: '/earn/optimism',
    sort: {
      field: 'maxRate',
      direction: SortDirection.Desc,
    },
    requestParams: {
      tokenName: ['OP', 'WOP', 'SOP', 'STOP'],
    },
    isShowPlatformFilter: true,
    isShowTokenFilter: false,
  },
  {
    alias: 'earn-avalanche',
    path: '/earn/avalanche',
    sort: {
      field: 'maxRate',
      direction: SortDirection.Desc,
    },
    requestParams: {
      tokenName: ['AVAX', 'WAVAX', 'SAVAX', 'STAVAX'],
    },
    isShowPlatformFilter: true,
    isShowTokenFilter: false,
  },
];
