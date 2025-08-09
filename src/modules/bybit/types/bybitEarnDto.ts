export interface BybitEarnsDto {
  result: {
    coin_products: BybitEarnDto[];
  };
}

// чтобы получить корректный apy нужно разделить apy на 1_000_000
export interface BybitEarnDto {
  coin: number;
  apy_min_e8: string;
  apy_max_e8: string;
  product_types: BybitProductType[];
}

export interface BybitProductType {
  product_type: number;
  apy_min_e8: string;
  apy_max_e8: string;
  duration_min: number;
  duration_max: number;
  tiered_apy_list: {
    from_num: string;
    to_num: string;
    apy_e8: string;
    tiered_reward_apy_e8: string;
  }[];
}
