import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';
import { EarnItemLevel, EarnItemBadge } from './types/EarnItem';

@Entity('earn_data')
@Index(['platformName', 'maxRate', 'tokenName'])
export class EarnEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  name?: string;

  @Column({ type: 'varchar' })
  tokenName: string;

  @Column({
    type: 'enum',
    enum: ['flexible', 'fixed'],
    default: 'flexible',
  })
  periodType: 'flexible' | 'fixed';

  @Column({ type: 'varchar' })
  platformName: string;

  @Column({ type: 'varchar' })
  platformLink: string;

  @Column({ type: 'varchar', nullable: true })
  platformRefLink?: string;

  @Column({
    type: 'enum',
    enum: EarnItemLevel,
    default: EarnItemLevel.Normal,
  })
  productLevel: EarnItemLevel;

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  maxRate: number;

  @Column({ type: 'json', nullable: true })
  rateSettings?: Array<{
    min: number;
    max: number | 'Infinity';
    apy: number;
  }>;

  @Column({
    type: 'varchar',
    length: 50,
    transformer: {
      from: (value: string) =>
        value === 'Infinity' ? 'Infinity' : Number(value),
      to: (value: number | 'Infinity') => value.toString(),
    },
  })
  duration: number | 'Infinity';

  @Column({
    type: 'simple-array',
    nullable: true,
  })
  badges?: EarnItemBadge[];
}
