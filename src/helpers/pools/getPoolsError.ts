export const getPoolsError = (error: unknown, serviceName: string): string => {
  return `Get pools error: ${serviceName} ${error instanceof Error ? error.message : String(error)}`;
};
