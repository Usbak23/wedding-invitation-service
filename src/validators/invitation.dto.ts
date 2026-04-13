import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreateInvitationDto {
  @ApiProperty({ example: 'Ahmad' })
  @IsNotEmpty()
  @IsString()
  groom_name: string;

  @ApiProperty({ example: 'Siti' })
  @IsNotEmpty()
  @IsString()
  bride_name: string;

  @ApiPropertyOptional({ example: '2026-06-01T08:00:00Z' })
  @IsOptional()
  @IsDateString()
  akad_date?: string;

  @ApiPropertyOptional({ example: 'Masjid Al-Ikhlas, Jakarta' })
  @IsOptional()
  @IsString()
  akad_location?: string;

  @ApiPropertyOptional({ example: '2026-06-01T11:00:00Z' })
  @IsOptional()
  @IsDateString()
  resepsi_date?: string;

  @ApiPropertyOptional({ example: 'Gedung Serbaguna, Jakarta' })
  @IsOptional()
  @IsString()
  resepsi_location?: string;

  @ApiPropertyOptional({ example: 'Bersama keluarga besar kami mengundang kehadiran Anda' })
  @IsOptional()
  @IsString()
  custom_message?: string;

  @ApiPropertyOptional({ example: 'default' })
  @IsOptional()
  @IsString()
  template?: string;
}

export class UpdateInvitationDto extends PartialType(CreateInvitationDto) {}
