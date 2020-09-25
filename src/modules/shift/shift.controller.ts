import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  HttpCode,
  ParseUUIDPipe,
  Delete,
} from '@nestjs/common';
import { ResponseDto } from '../../utils/ResponseDto';
import { GetShiftsResponse } from './dto/GetShiftsResponse';
import { GetShiftResponse } from './dto/GetShiftResponse';
import { ShiftService } from './shift.service';
import { ValidationPipe } from '../ValidationPipe';
import { BookTalentRequest } from './dto/BookTalentRequest';
import { CancelResponse } from '../../utils/CancelResponse';

@Controller('shift')
export class ShiftController {
  constructor(private readonly shiftService: ShiftService) { }

  @Get(':jobId')
  async getShifts(
    @Param('jobId', new ParseUUIDPipe()) jobId: string,
  ): Promise<ResponseDto<GetShiftsResponse>> {
    const shifts = await this.shiftService.getShifts(jobId);
    return new ResponseDto<GetShiftsResponse>(
      new GetShiftsResponse(
        shifts.map(shift => {
          return new GetShiftResponse(
            shift.id,
            shift.talentId,
            shift.jobId,
            shift.startTime,
            shift.endTime,
          );
        }),
      ),
    );
  }

  @Delete(':id')
  async cancelShift(
    @Param('id') id: string
  ): Promise<ResponseDto<CancelResponse>> {
    const cancelationResult = await this.shiftService.cancelShift(id);
    if (cancelationResult.affected) {
      await this.shiftService.cancelShift(id);
    }
    return new ResponseDto<CancelResponse>(new CancelResponse(id, !!cancelationResult.affected));
  }

  @Patch(':shiftId/book')
  @HttpCode(204)
  async bookTalent(
    @Param('shiftId', new ParseUUIDPipe()) shiftId: string,
    @Body(new ValidationPipe<BookTalentRequest>()) dto: BookTalentRequest,
  ): Promise<void> {
    this.shiftService.bookTalent(shiftId, dto.talent);
  }
}
