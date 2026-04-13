import { IsIn, IsOptional, IsString } from 'class-validator';

export class CreateAnalyticDto {
  @IsIn(['view', 'rsvp_open', 'share'])
  event: string;

  @IsOptional()
  @IsString()
  invitation_id?: string;
}
