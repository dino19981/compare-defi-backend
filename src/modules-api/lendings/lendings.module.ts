import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LendingsController } from './lendings.controller';
import { LendingsService } from './lendings.service';
import { LendingsRepository } from './lendings.repository';
import { LendingEntity, LendingSchema } from './lendings.entity';
import { AaveModule } from '@modules/aave';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LendingEntity.name, schema: LendingSchema },
    ]),
    AaveModule,
  ],
  controllers: [LendingsController],
  providers: [LendingsService, LendingsRepository],
  exports: [LendingsService],
})
export class LendingsModule {}
