import { ApiProperty } from '@nestjs/swagger';

export class HealthResponseDto {
  @ApiProperty({
    description: 'Сообщение о статусе API',
    example: 'Hello World!',
    type: String,
  })
  message: string;

  @ApiProperty({
    description: 'Временная метка ответа',
    example: '2024-01-01T00:00:00.000Z',
    type: String,
  })
  timestamp: string;
}
