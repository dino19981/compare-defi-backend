export interface NaviEarnDto {
  data: NaviEarnItemDto[];
}

export interface NaviEarnItemDto {
  id: string;
  name: string;
  apy7d: {
    value: number;
  };
  apy30d: {
    value: number;
  };
  instantAPR: number;
}
