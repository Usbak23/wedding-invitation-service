import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateGuestDto {
  @ApiProperty({ example: 'Budi Santoso' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: '08123456789' })
  @IsOptional()
  @IsString()
  phone?: string;
}

export class BulkCreateGuestDto {
  @ApiProperty({ type: [CreateGuestDto] })
  @IsNotEmpty()
  guests: CreateGuestDto[];
}
