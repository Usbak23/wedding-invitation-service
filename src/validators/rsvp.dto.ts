import { IsIn, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { RsvpStatus } from '../types/rsvp-status.type';

export class CreateRsvpDto {
    @ApiProperty({ example: 'ca7fea1a-6aa9-4dd1-83ab-d0fd0a3a39b7' })
    @IsUUID()
    guest_id: string;

    @ApiProperty({ example: '4a3bf159-70dd-4b30-abd6-aeee740d20bc' })
    @IsUUID()
    invitation_id: string;

    @ApiProperty({ enum: ['hadir', 'tidak', 'mungkin'], example: 'hadir' })
    @IsNotEmpty()
    @IsIn(['hadir', 'tidak', 'mungkin'])
    status: RsvpStatus;

    @ApiPropertyOptional({ example: 2 })
    @IsOptional()
    @IsInt()
    @Min(1)
    total_persons?: number;

    @ApiPropertyOptional({ example: 'Insya Allah kami hadir!' })
    @IsOptional()
    @IsString()
    message?: string;
}
