export interface LidoEarnDto {
  data: {
    aprs: LidoAprDto[];
  };
}

export interface LidoAprDto {
  timeUnix: number;
  apr: number;
}
