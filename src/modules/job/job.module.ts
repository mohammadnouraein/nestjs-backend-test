import { Module } from '@nestjs/common';
import { JobController } from './job.controller';
import { JobService } from './job.service';
import { ShiftModule } from '../shift/shift.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './job.entity';
import { ShiftService } from '../shift/shift.service';

@Module({
  imports: [TypeOrmModule.forFeature([Job]), ShiftModule],
  controllers: [JobController],
  providers: [JobService, ShiftService],
  exports: [JobService],
})
export class JobModule { }
