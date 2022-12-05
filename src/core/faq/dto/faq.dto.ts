import { IsNotEmpty, IsObject } from 'class-validator';

export class FaqDatato {
  @IsNotEmpty()
  @IsObject()
  data: {
    time: number;
    blocks: any;
    version: string;
  };
}
