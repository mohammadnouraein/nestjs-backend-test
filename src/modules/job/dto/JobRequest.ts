import { IsNotEmpty, IsDate, IsUUID, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { IsNull } from 'typeorm';

export class JobRequest {
  @IsNotEmpty()
  @IsUUID(4)
  companyId: string;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  start: Date;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  end: Date;

  @Type(() => Number)
  @IsNumber()
  startTime: number;

  @Type(() => Number)
  @IsNumber()
  endTime: number;
}
