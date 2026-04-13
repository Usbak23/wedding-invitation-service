import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateInvitationDto {
  @IsNotEmpty()
  @IsString()
  groom_name: string;

  @IsNotEmpty()
  @IsString()
  bride_name: string;

  @IsOptional()
  @IsDateString()
  akad_date?: string;

  @IsOptional()
  @IsString()
  akad_location?: string;

  @IsOptional()
  @IsDateString()
  resepsi_date?: string;

  @IsOptional()
  @IsString()
  resepsi_location?: string;

  @IsOptional()
  @IsString()
  custom_message?: string;

  @IsOptional()
  @IsString()
  template?: string;
}

export class UpdateInvitationDto extends CreateInvitationDto {}
