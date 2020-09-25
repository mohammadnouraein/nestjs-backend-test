import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Shift } from './shift.entity';
import { v4 as UUIDv4 } from 'uuid';
@Injectable()
export class ShiftService {

  constructor(
    @InjectRepository(Shift)
    private readonly repository: Repository<Shift>,
  ) { }

  public async getShifts(uuid: string): Promise<Shift[]> {
    return this.repository.find({
      where: {
        jobId: uuid,
      },
    });
  }

  async cancelShiftsByTalentId(talentId: string): Promise<DeleteResult> {
    const selectedShifts = await this.repository.find({ talentId });
    if (selectedShifts.length) {
      try {
        return this.repository.delete({ talentId }).then(deleteRes => {
          if (deleteRes) {
            let day = new Date();
            day.setDate(new Date().getDate() + 1);

            const startTime = new Date(day);
            startTime.setUTCHours(8);
            const endTime = new Date(day);
            endTime.setUTCHours(17);
            const shift = new Shift();
            shift.id = UUIDv4();
            //shift.job = job;
            shift.startTime = startTime;
            shift.endTime = endTime;

            this.repository.save(shift);
          }

          return deleteRes;
        });
      } catch (e) {
        // TODO: Log error here
        throw new HttpException(`Could not cancel the shifts for talent with talent id:${talentId}`, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  async cancelShiftByJobId(jobId: string): Promise<DeleteResult> {
    const selectedShifts = await this.repository.find({ jobId });
    if (selectedShifts.length) {
      try {
        return this.repository.delete({ jobId });
      } catch (e) {
        // TODO: Log error here
        throw new HttpException(`Could not cancel the shifts for job with job id:${jobId}`, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } else {
      // Uncomment below line of code if having shift in job is mandatory
      // throw new HttpException(`Couldn't find any shift for job :${jobId}`, HttpStatus.NOT_FOUND);
    }
  }

  async cancelShift(id: string): Promise<DeleteResult> {
    const selectedShift = await this.repository.findOne(id);
    if (selectedShift) {
      try {
        return this.repository.delete({ id });
      } catch (e) {
        // TODO: Log error here
        throw new HttpException(`Could not cancel the shift with id:${id}`, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } else {
      throw new HttpException(`Couldn't find any shift with id :${id}`, HttpStatus.NOT_FOUND);
    }
  }

  public async bookTalent(talent: string, shiftId: string): Promise<void> {
    this.repository.findOne(shiftId).then(shift => {
      shift.talentId = talent;
      this.repository.save(shift);
    });
  }
}
