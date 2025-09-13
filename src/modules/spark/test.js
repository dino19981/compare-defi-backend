const { ethers } = require('ethers');

// === 1. RPC ===
const RPC_URL = 'https://ethereum.therpc.io'; // вставь свой RPC
const provider = new ethers.JsonRpcProvider(RPC_URL);

// === 2. Контракты Aave v2 ===
const LENDING_POOL_ADDRESS = '0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9';
const PROTOCOL_DATA_PROVIDER = '0x497a1994c46d4f6C864904A9f1fac6328Cb7C8a6'; // v3 ProtocolDataProvider
// const PROTOCOL_DATA_PROVIDER = '0x057835Ad21a177dbdd3090bB1CAE03EaCF78Fc6d'; // v2 ProtocolDataProvider

// ABI куски
const lendingPoolAbi = [
  'function getReserveData(address asset) view returns (uint256,uint128,uint128,uint128 currentLiquidityRate,uint128 currentVariableBorrowRate,uint128,uint40,address,address,address,address,uint8)',
];

const dataProviderAbi = [
  'function getAllReservesTokens() view returns (tuple(string symbol, address tokenAddress)[])',
];

// === 3. Объекты контрактов ===
const lendingPool = new ethers.Contract(
  LENDING_POOL_ADDRESS,
  lendingPoolAbi,
  provider,
);
const dataProvider = new ethers.Contract(
  PROTOCOL_DATA_PROVIDER,
  dataProviderAbi,
  provider,
);

// === 4. Основная функция ===
async function main() {
  const tokens = await dataProvider.getAllReservesTokens();

  const results = [];
  for (const { symbol, tokenAddress } of tokens) {
    try {
      const reserveData = await lendingPool.getReserveData(tokenAddress);

      const liquidityRate = reserveData.currentLiquidityRate; // uint128
      const variableBorrowRate = reserveData.currentVariableBorrowRate; // uint128

      // Приводим из RAY (1e27) в %
      const depositAPY = (Number(liquidityRate) / 1e27) * 100;
      const borrowAPY = (Number(variableBorrowRate) / 1e27) * 100;

      if (symbol === 'USDT') {
        console.log(reserveData);
      }

      results.push({
        symbol,
        address: tokenAddress,
        depositAPY,
        borrowAPY,
      });
    } catch (err) {
      //   console.error(`Ошибка для ${symbol}:`, err.message);
    }
  }

  // === 5. Вывод ===
  for (const r of results) {
    // console.log(r, 'rrrrr');
    // console.log(
    //   `${r.symbol.padEnd(6)} | Deposit APY: ${r.depositAPY.toFixed(2)}% | Borrow APY: ${r.borrowAPY.toFixed(2)}%`,
    // );
  }

  console.log(results);
}

main().catch(console.error);
