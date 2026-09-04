import { IsDateString } from 'class-validator';

export class GetAveragesQueryDto {
  @IsDateString({ strict: true })
  from!: string;

  @IsDateString({ strict: true })
  to!: string;
}
