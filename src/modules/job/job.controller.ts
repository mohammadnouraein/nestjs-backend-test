import { Controller, Post, Body, Get, Delete, Param, HttpException, HttpStatus } from '@nestjs/common';
import { v4 as UUIDv4 } from 'uuid';
import { JobService } from './job.service';
import { ResponseDto } from '../../utils/ResponseDto';
import { ValidationPipe } from '../ValidationPipe';
import { JobRequest } from './dto/JobRequest';
import { JobRequestResponse } from './dto/JobRequestResponse';
import { ShiftService } from '../shift/shift.service';
import { CancelResponse } from '../../utils/CancelResponse';

@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService, private readonly shiftService: ShiftService) { }

  @Post()
  async requestJob(
    @Body(new ValidationPipe<JobRequest>())
    dto: JobRequest,
  ): Promise<ResponseDto<JobRequestResponse>> {
    const today = new Date();
    let errors = [];
    if (dto.start < today || dto.start >= dto.end) {
      errors.push('The start date cannot be in the past and the end date should be after the start date');
    }
    if (dto.endTime - dto.startTime > 8 || dto.endTime - dto.startTime < 2) {
      errors.push('shifts can only be at most 8 hours long and minimum 2 hours');
    }
    if (errors.length) {
      const errMessage = errors.map((err, ind) => ind + '.' + err).join(',');
      throw new HttpException(`validation error :${errMessage}`, HttpStatus.BAD_REQUEST);
    } else {
      const job = await this.jobService.createJob(UUIDv4(), dto.start, dto.end, dto.startTime, dto.endTime);
      return new ResponseDto<JobRequestResponse>(new JobRequestResponse(job.id));

    }
  }

  @Delete(':id')
  async cancelJob(
    @Param('id') id: string
  ): Promise<ResponseDto<CancelResponse>> {
    const cancelationResult = await this.jobService.cancelJob(id);
    if (cancelationResult.affected) {
      await this.shiftService.cancelShiftByJobId(id);
    }
    return new ResponseDto<CancelResponse>(new CancelResponse(id, !!cancelationResult.affected));
  }
}
