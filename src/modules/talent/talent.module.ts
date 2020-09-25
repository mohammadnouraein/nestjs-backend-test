import { Module } from '@nestjs/common';
import { TalentController } from './talent.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShiftService } from '../shift/shift.service';
import { Shift } from '../shift/shift.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Shift])],
  controllers: [TalentController],
  providers: [ShiftService],
  exports: [ShiftService],
})
export class TalentModule { }
