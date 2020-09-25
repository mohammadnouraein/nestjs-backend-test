import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as UUIDv4 } from 'uuid';
import { eachDayOfInterval } from 'date-fns';
import { Repository, DeleteResult } from 'typeorm';
import { Job } from './job.entity';
import { Shift } from '../shift/shift.entity';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
  ) { }

  async createJob(uuid: string, date1: Date, date2: Date): Promise<Job> {
    date1.setUTCHours(8);
    date2.setUTCHours(17);
    const job = new Job();
    job.id = uuid;
    job.companyId = UUIDv4();
    job.startTime = date1;
    job.endTime = date2;

    job.shifts = eachDayOfInterval({ start: date1, end: date2 }).map(day => {
      const startTime = new Date(day);
      startTime.setUTCHours(8);
      const endTime = new Date(day);
      endTime.setUTCHours(17);
      const shift = new Shift();
      shift.id = UUIDv4();
      shift.job = job;
      shift.startTime = startTime;
      shift.endTime = endTime;
      return shift;
    });

    return this.jobRepository.save(job);
  }

  async cancelJob(id: string): Promise<DeleteResult> {
    const selectedJob = await this.jobRepository.findOne(id);
    if (selectedJob) {
      try {
        return this.jobRepository.delete({ id });
      } catch (e) {
        // TODO: Log error here
        throw new HttpException(`Could not cancel the job with id:${id}`, HttpStatus.INTERNAL_SERVER_ERROR);
      }

    } else {
      throw new HttpException(`Could not find the job with id:${id}`, HttpStatus.NOT_FOUND);
    }
  }

  public async getJobs(): Promise<Job[]> {
    return this.jobRepository.find();
  }
}
