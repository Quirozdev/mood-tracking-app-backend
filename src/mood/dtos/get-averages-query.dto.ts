import { IsNumber } from 'class-validator';

export class GetAveragesQueryDto {
  @IsNumber()
  lastCheckIns!: number;
}
