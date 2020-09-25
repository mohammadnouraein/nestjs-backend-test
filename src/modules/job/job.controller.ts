import { Controller, Post, Body, Get, Delete, Param } from '@nestjs/common';
import { v4 as UUIDv4 } from 'uuid';
import { JobService } from './job.service';
import { ResponseDto } from '../../utils/ResponseDto';
import { ValidationPipe } from '../ValidationPipe';
import { JobRequest } from './dto/JobRequest';
import { JobRequestResponse } from './dto/JobRequestResponse';
import { ShiftService } from '../shift/shift.service';

@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService, private readonly shiftService: ShiftService) { }

  @Post()
  async requestJob(
    @Body(new ValidationPipe<JobRequest>())
    dto: JobRequest,
  ): Promise<ResponseDto<JobRequestResponse>> {
    const job = await this.jobService.createJob(UUIDv4(), dto.start, dto.end);
    return new ResponseDto<JobRequestResponse>(new JobRequestResponse(job.id));
  }

  @Delete(':id')
  async cancelJob(
    @Param('id') id: string
  ): Promise<ResponseDto<JobRequestResponse>> {
    const cancelationResult = await this.jobService.cancelJob(id);
    if (cancelationResult.affected) {
      await this.shiftService.cancelShiftByJobId(id);
    }
    return new ResponseDto<JobRequestResponse>(new JobRequestResponse(cancelationResult.affected ? id : ''));
  }
}
