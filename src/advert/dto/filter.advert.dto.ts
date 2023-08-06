import { ApiProperty } from '@nestjs/swagger';

export class FilterAdvertDto {
  @ApiProperty()
  search: string;
  @ApiProperty()
  category: string;
}