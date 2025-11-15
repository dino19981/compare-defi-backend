export enum HtxEarnType {
  Recommended = 'recommended',
  NewUsers = 'new_users',
}

export interface HtxEarnsDto {
  data: {
    recommendProject: HtxEarnDto[];
  };
}

export interface HtxEarnDto {
  currency: string;
  icon: string;
  type: HtxEarnType;
  projectList: HtxEarnProductDto[];
}

export interface HtxEarnProductDto {
  viewYearRate: number;
  projectEnumType: number;
  term: number;
  type: number;
}

export interface HtxNewUsersEarnsDto {
  data: HtxNewUserEarnDto[];
}

export interface HtxNewUserEarnDto {
  viewYearRate: number;
  projectEnumType: number;
  term: number;
  type: number;
  icon: string;
  currency: string;
}
