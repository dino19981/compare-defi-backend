import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';
import { PoolItemTokenDto } from './dtos/poolItemToken.dto';
import { PoolItemChainDto } from './dtos/poolItemChain.dto';
import { PoolItemPlatformDto } from './dtos/poolItemPlatformDto.dto';
import { PoolItemBadge } from './types';

@Entity('pools_data')
@Index(['id'])
export class PoolEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'json' })
  firstToken: PoolItemTokenDto;

  @Column({ type: 'json' })
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

  @Column({ type: 'varchar' })
  apr: string;

  @Column({
    type: 'simple-array',
    nullable: true,
  })
  badges?: PoolItemBadge[];
}
