export enum HtxEarnType {
  Recommended = 'recommended',
  // NewUsers = 'new_users',
  Flexible = 'flexible',
  Fixed = 'fixed',
  LimitList = 'limitList',
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
  productId: string;
  viewYearRate: number;
  projectEnumType: number;
  term: number;
  type: number;
}

export interface HtxNewUsersEarnsDto {
  data: HtxNewUserEarnDto[];
}

export interface HtxNewUserEarnDto {
  productId: string;
  viewYearRate: number;
  projectEnumType: number;
  term: number;
  type: number;
  icon: string;
  currency: string;
}
