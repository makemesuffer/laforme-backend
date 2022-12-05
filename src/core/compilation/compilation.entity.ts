import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
  Column,
} from 'typeorm';
import { CompilationProductEntity } from '../compilation-product/compilation-product.entity';

@Entity({ name: 'compilation' })
export class CompilationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({
    name: 'created_date',
    readonly: true,
  })
  createdDate: Date;

  @Column({
    type: 'varchar',
    name: 'title',
    default: ' ',
  })
  title: string;

  @Column({
    type: 'varchar',
    name: 'path',
    nullable: true,
  })
  path: string;

  @OneToMany(
    () => CompilationProductEntity,
    (res: CompilationProductEntity) => res.compilation,
    { cascade: true },
  )
  compilationProducts: CompilationProductEntity[];

  @Column({
    type: 'bool',
    name: 'in_english',
    default: false,
  })
  inEnglish?: boolean;
}
