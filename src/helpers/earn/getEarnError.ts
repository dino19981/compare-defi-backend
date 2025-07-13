export const getEarnError = (error: unknown, serviceName: string): string => {
  return `Get earn error: ${serviceName} ${error instanceof Error ? error.message : String(error)}`;
};
