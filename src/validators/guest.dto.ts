import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateGuestDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  phone?: string;
}

export class BulkCreateGuestDto {
  @IsNotEmpty()
  guests: CreateGuestDto[];
}
