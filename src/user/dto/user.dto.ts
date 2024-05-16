import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'shivam',
    required: false,
  })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'shivam@gmail.com',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    example: '12345',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
