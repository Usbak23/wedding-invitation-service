import { IsIn, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import type { RsvpStatus } from '../types/rsvp-status.type';

export class CreateRsvpDto {
  @IsUUID()
  guest_id: string;

  @IsUUID()
  invitation_id: string;

  @IsNotEmpty()
  @IsIn(['hadir', 'tidak', 'mungkin'])
  status: RsvpStatus;

  @IsOptional()
  @IsInt()
  @Min(1)
  total_persons?: number;

  @IsOptional()
  @IsString()
  message?: string;
}
