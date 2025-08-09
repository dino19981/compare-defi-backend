const productTypeToName: Record<number, string> = {
  2: 'Dual Asset',
  4: 'Flexible Savings',
  5: 'Liquidity Mining',
  6: 'Fixed Term',
  8: 'On-Chain Earn',
  9: 'Wealth Management',
};

export const excludedByBitStackingProductTypes = [2, 5];

export const getEarnItemNameByProductType = (productType: number) => {
  return productTypeToName[productType];
};
