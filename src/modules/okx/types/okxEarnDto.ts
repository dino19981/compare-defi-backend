export interface OkxEarnsDto {
  data: {
    currencies: OkxEarnDto[];
  };
}

export interface OkxEarnDto {
  investCurrency: {
    currencyName: string;
    currencyIcon: string;
  };
  rate: {
    rateNum: {
      // number[]
      value: string[];
      type: string;
    };
  };
}

// const data = {
//   balance: '0.0000003',
//   investCurrency: {
//     currencyIcon:
//       'https://www.okx.com/cdn/oksupport/asset/currency/icon/usdt20241209162957.png',
//     currencyId: 7,
//     currencyName: 'USDT',
//   },
//   labels: [],
//   productEngName: 'financial',
//   products: [
//     {
//       bonusDescription: 'Бонус 10% за 180 д. | Для новых пользователей',
//       interestCurrency: {
//         currencyIcon:
//           'https://www.okx.com/cdn/oksupport/asset/currency/icon/usdt20241209162957.png',
//         currencyId: 7,
//         currencyName: 'USDT',
//       },
//       isLearnAndEarn: false,
//       labels: [],
//       lockUpPeriod: 0,
//       productsType: 1,
//       purchaseStatus: 1,
//       rate: {
//         rateNum: {
//           value: ['7.00'],
//           type: '1',
//         },
//         rateType: 'SINGLE_RATE',
//       },
//       savingType: 0,
//       term: {
//         labels: [],
//         show: true,
//         type: 'DAY',
//         value: 1,
//       },
//       type: 1,
//     },
//   ],
//   productsType: 1,
//   rate: {
//     rateNum: {
//       value: ['7.00'],
//       type: '1',
//     },
//     rateType: 'SINGLE_RATE',
//   },
//   redirectUrl:
//     '/earn/subscribe?navigationBarHidden=1&productsType=1&currencyId=7&savingType=0&type=1',
//   savingType: 0,
//   term: {
//     labels: [],
//     show: true,
//     type: 'DAY',
//     value: 1,
//   },
//   type: 1,
//   valuationUSD: '0',
// };
