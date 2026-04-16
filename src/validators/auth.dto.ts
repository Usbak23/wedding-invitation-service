import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
    @ApiProperty({ example: 'Mubarok' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: 'mubarok@test.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: '123456', minLength: 6 })
    @IsNotEmpty()
    @MinLength(6)
    password: string;
}

export class LoginDto {
    @ApiProperty({ example: 'mubarok@test.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: '123456' })
    @IsNotEmpty()
    password: string;
}
