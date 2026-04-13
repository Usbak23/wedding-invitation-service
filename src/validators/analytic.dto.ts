import { IsIn, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAnalyticDto {
  @ApiProperty({ enum: ['view', 'rsvp_open', 'share'], example: 'view' })
  @IsIn(['view', 'rsvp_open', 'share'])
  event: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  invitation_id?: string;
}
