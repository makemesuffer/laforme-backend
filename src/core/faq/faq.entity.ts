import { Transform } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

interface IFaq {
  blocks: [];
  time: number;
  version: string;
}

@Entity({ name: 'faq' })
export class FaqEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
  })
  @Transform((value: string) => value.trim().toLowerCase())
  name: string;

  @Column({
    type: 'json',
    name: 'data',
    nullable: true,
  })
  data: IFaq;
}
