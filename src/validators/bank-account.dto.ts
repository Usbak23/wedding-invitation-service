import { IsNotEmpty, IsOptional, IsString, IsInt, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBankAccountDto {
  @ApiProperty({ example: 'BCA' })
  @IsNotEmpty()
  @IsString()
  bank_name: string;

  @ApiProperty({ example: 'Ahmad Fulan' })
  @IsNotEmpty()
  @IsString()
  account_name: string;

  @ApiProperty({ example: '1234567890' })
  @IsNotEmpty()
  @IsString()
  account_number: string;

  @ApiPropertyOptional({ example: 'https://example.com/bca-logo.png' })
  @IsOptional()
  @IsString()
  logo_url?: string;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  order_index?: number;
}
