const productTypeToName: Record<number, string> = {
  2: 'Dual Asset',
  4: 'Flexible Savings',
  5: 'Liquidity Mining',
  6: 'Fixed Term',
  8: 'On-Chain Earn',
  9: 'Wealth Management',
};
// Исключил 6 потому что выдавал айтем которого нет на байбите
export const excludedByBitStackingProductTypes = [2, 5, 6];

export const getEarnItemNameByProductType = (productType: number) => {
  return productTypeToName[productType];
};
