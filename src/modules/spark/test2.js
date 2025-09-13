require('dotenv').config();
const { JsonRpcProvider, Contract, formatUnits } = require('ethers');

const RPC_URL =
  process.env.RPC_URL ||
  'https://base.drpc.org' ||
  'https://ethereum-rpc.publicnode.com' ||
  'https://eth.llamarpc.com'; // JSON-RPC!
const provider = new JsonRpcProvider(RPC_URL);

// Aave v3 Ethereum: ProtocolDataProvider
const DATA_PROVIDER = '0x497a1994c46d4f6C864904A9f1fac6328Cb7C8a6'; // v3 mainnet
// https://docs.aave.com/faq/developers/deployed-contracts/addresses (Ethereum v3)

const dataProviderAbi = [
  // список всех резервов (symbol, tokenAddress)
  'function getAllReservesTokens() view returns (tuple(string symbol, address tokenAddress)[])',

  // конфиг резерва (даст isActive/isFrozen/borrowingEnabled и т.п.)
  'function getReserveConfigurationData(address asset) view returns (uint256 decimals,uint256 ltv,uint256 liquidationThreshold,uint256 liquidationBonus,uint256 reserveFactor,bool usageAsCollateralEnabled,bool borrowingEnabled,bool stableBorrowRateEnabled,bool isActive,bool isFrozen)',

  // сами ставки/индексы из пула
  'function getReserveData(address asset) view returns (uint256 unbacked,uint256 accruedToTreasuryScaled,uint256 totalAToken,uint256 totalStableDebt,uint256 totalVariableDebt,uint256 liquidityRate,uint256 variableBorrowRate,uint256 stableBorrowRate,uint256 averageStableBorrowRate,uint256 liquidityIndex,uint256 variableBorrowIndex,uint40 lastUpdateTimestamp)',
];

const dataProvider = new Contract(DATA_PROVIDER, dataProviderAbi, provider);

const SECONDS_PER_YEAR = 31_536_000;

function aprRayToNumber(aprRayBigInt) {
  // APR в Ray (1e27) -> десятичное число (напр. 0.0473 = 4.73%)
  return parseFloat(formatUnits(aprRayBigInt, 27));
}

function aprToApy(apr) {
  // Пересчет APR -> APY с поминутно/посекундной капитализацией как в UI
  return Math.pow(1 + apr / SECONDS_PER_YEAR, SECONDS_PER_YEAR) - 1;
}

function pct(n) {
  return +(n * 100).toFixed(2);
}

async function main() {
  console.log('beforebeforebeforebefore');

  const reserves = await dataProvider.getAllReservesTokens();
  reserves.length = 1;
  console.log(reserves.length, 'reservesreserves');

  const symbol = reserves[0].symbol;
  const tokenAddress = reserves[0].tokenAddress;

  // Параллельно собираем данные по каждому активу
  const rows = await Promise.all(
    reserves.map(async (data) => {
      const symbol = data.symbol;
      const tokenAddress = data.tokenAddress;

      try {
        const [cfg, rd] = await Promise.all([
          dataProvider.getReserveConfigurationData(tokenAddress),
          dataProvider.getReserveData(tokenAddress),
        ]);

        const isActive = cfg[8];
        const isFrozen = cfg[9];

        const liquidityRateRay = rd[5]; // deposit APR (ray)
        const variableBorrowRateRay = rd[6]; // borrow APR variable (ray)

        const depositAPR = aprRayToNumber(liquidityRateRay);
        const borrowVarAPR = aprRayToNumber(variableBorrowRateRay);

        const depositAPY = aprToApy(depositAPR);
        const borrowVarAPY = aprToApy(borrowVarAPR);

        console.log({
          symbol,
          address: tokenAddress,
          isActive,
          isFrozen,
          depositAPR: pct(depositAPR),
          depositAPY: pct(depositAPY),
          borrowVarAPR: pct(borrowVarAPR),
          borrowVarAPY: pct(borrowVarAPY),
          lastUpdate: Number(rd[11]),
        });

        return {
          symbol,
          address: tokenAddress,
          isActive,
          isFrozen,
          depositAPR: pct(depositAPR),
          depositAPY: pct(depositAPY),
          borrowVarAPR: pct(borrowVarAPR),
          borrowVarAPY: pct(borrowVarAPY),
          lastUpdate: Number(rd[11]),
        };
      } catch (error) {
        console.error(error);
      }
    }),
  );

  // Пример: вывести ТОП по депозитной доходности
  //   rows.sort((a, b) => b.depositAPY - a.depositAPY);
  //   console.table(rows, [
  //     'symbol',
  //     'depositAPY',
  //     'depositAPR',
  //     'borrowVarAPR',
  //     'borrowVarAPY',
  //     'isActive',
  //     'isFrozen',
  //     'address',
  //   ]);

  // Если нужен конкретный токен (например, USDT):
  //   const usdt = rows.find((r) => r.symbol.toUpperCase() === 'USDT');
  //   if (usdt) {
  //     console.log('USDT:', usdt);
  //   }
}

main().catch(console.error);
