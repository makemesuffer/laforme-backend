import { ProductTypeEnum } from 'src/common/enum/type.enum';
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity({ name: 'category' })
export class CategoryEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    name: 'category_name_ru',
    nullable: true,
  })
  categoryNameRu!: string;

  @Column({
    type: 'varchar',
    name: 'category_name_en',
    nullable: true,
  })
  categoryNameEn!: string;

  @Column({
    type: 'enum',
    enum: ProductTypeEnum,
    nullable: true,
  })
  type: ProductTypeEnum;
}
