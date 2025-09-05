import { Module } from '@nestjs/common';
import { LendingsController } from './lendings.controller';
import { LendingsService } from './lendings.service';
import { LendingsRepository } from './lendings.repository';
import { DatabaseModule } from '@modules/database';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PoolEntity } from './lendings.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PoolEntity]), DatabaseModule],
  controllers: [LendingsController],
  providers: [LendingsService, LendingsRepository],
  exports: [LendingsService],
})
export class LendingsModule {}
