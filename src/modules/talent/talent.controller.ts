import {
  Controller,
  Param,
  Delete,
} from '@nestjs/common';
import { ResponseDto } from '../../utils/ResponseDto';
import { CancelResponse } from '../../utils/CancelResponse';
import { ShiftService } from '../shift/shift.service';

@Controller('talent')
export class TalentController {
  constructor(private readonly shiftService: ShiftService) { }

  @Delete(':id/shifts')
  async cancelShiftsForTalent(
    @Param('id') id: string
  ): Promise<ResponseDto<CancelResponse>> {
    const cancelationResult = await this.shiftService.cancelShiftsByTalentId(id);
    return new ResponseDto<CancelResponse>(new CancelResponse(id, !!cancelationResult.affected));
  }
}
