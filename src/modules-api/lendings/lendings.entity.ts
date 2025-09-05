import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';
import { PoolItemTokenDto } from './dtos/lendingToken.dto';
import { PoolItemChainDto } from './dtos/poolItemChain.dto';
import { PoolItemPlatformDto } from './dtos/lendingPlatformDto.dto';
import { PoolItemBadge } from './types';

@Entity('pools_data')
@Index('IDX_FIRST_TOKEN_NAME', { synchronize: false })
@Index('IDX_SECOND_TOKEN_NAME', { synchronize: false })
@Index('IDX_CHAIN_NAME', { synchronize: false })
@Index('IDX_PLATFORM_NAME', { synchronize: false })
export class PoolEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'json', name: 'firstToken' })
  firstToken: PoolItemTokenDto;

  @Column({ type: 'json', name: 'secondToken' })
  secondToken: PoolItemTokenDto;

  @Column({ type: 'json' })
  chain: PoolItemChainDto;

  @Column({ type: 'json' })
  platform: PoolItemPlatformDto;

  @Column({ type: 'varchar' })
  tvl: string;

  @Column({ type: 'varchar' })
  volume: string;

  @Column({ type: 'varchar' })
  fee: string;

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  apr: number;

  @Column({
    type: 'simple-array',
    nullable: true,
  })
  badges?: PoolItemBadge[];
}
