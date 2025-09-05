import { SelectQueryBuilder } from 'typeorm';
import { PoolEntity } from '../lendings.entity';

export const getSqlRequestForTokensFilter = (
  filters: Record<string, any>,
  queryBuilder: SelectQueryBuilder<PoolEntity>,
) => {
  if (!filters.firstTokens) return;

  const firstTokens: string[] = filters.firstTokens;
  const secondTokens: string[] = filters.secondTokens || [];

  console.log('Фильтруем по токенам:', firstTokens, secondTokens);

  const uniqueTokenCombinations = getUniqueTokenCombinations(
    firstTokens,
    secondTokens,
  );

  console.log('Комбинации токенов:', uniqueTokenCombinations);

  const orConditions = uniqueTokenCombinations
    .map(
      ({ secondToken }, index) =>
        `(LOWER(pool."firstToken"->>'name') LIKE LOWER(:firstToken${index})${secondToken ? ` AND LOWER(pool."secondToken"->>'name') LIKE LOWER(:secondToken${index})` : ''} )`,
    )
    .join(' OR ');

  const parameters = uniqueTokenCombinations.reduce(
    (acc, { firstToken, secondToken }, index) => {
      acc[`firstToken${index}`] = `%${firstToken}%`;

      if (secondToken) {
        acc[`secondToken${index}`] = `%${secondToken}%`;
      }

      return acc;
    },
    {} as Record<string, string>,
  );

  console.log('SQL условие (case-insensitive LIKE):', orConditions);
  console.log('Параметры с % для LIKE:', parameters);

  queryBuilder.andWhere(`(${orConditions})`, parameters);
};

function getUniqueTokenCombinations(
  firstTokens: string[],
  secondTokens: string[],
): { firstToken: string; secondToken?: string }[] {
  if (!secondTokens.length) {
    return firstTokens.map((firstToken: string) => ({ firstToken }));
  }

  const tokenCombinations: Map<
    string,
    { firstToken: string; secondToken?: string }
  > = new Map();

  // Создаем все возможные комбинации токенов
  firstTokens.forEach((firstToken: string) => {
    secondTokens.forEach((secondToken: string) => {
      if (firstToken !== secondToken) {
        tokenCombinations.set(`${firstToken}-${secondToken}`, {
          firstToken,
          secondToken,
        });
      }
    });
  });

  secondTokens.forEach((firstToken: string) => {
    firstTokens.forEach((secondToken: string) => {
      if (firstToken !== secondToken) {
        tokenCombinations.set(`${firstToken}-${secondToken}`, {
          firstToken,
          secondToken,
        });
      }
    });
  });

  return Array.from(tokenCombinations.values());
}
