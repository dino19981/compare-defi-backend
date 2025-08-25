interface BaseChain {
  id: string;
  name: string;
  shortname: string;
  native_coin_id: string;
  image: {
    thumb: string;
    small: string;
    large: string;
  };
}

export interface ChainDto extends BaseChain {
  chain_identifier: number | null;
}

// Отфильтрованные сети, которые имеют chain_identifier
export interface Chain extends BaseChain {
  chain_identifier: number;
}

export interface Chains {
  chainById: Record<number, Chain>;
  chainByName: Record<string, Chain>;
}
