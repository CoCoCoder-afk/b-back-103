import { Module } from '@nestjs/common';
import { DosAttackService } from './dosAttack.service';
import { DosAttackController } from './dosAttack.controller';
import {HttpModule} from "@nestjs/axios";

@Module({
  imports: [HttpModule],
  providers: [DosAttackService],
  exports: [DosAttackService],
  controllers: [DosAttackController]
})
export class DosAttackModule {}
