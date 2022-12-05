import { SewingProductEntity } from './../sewing-product/sewing-product.entity';
import { PatternProductEntity } from './../pattern-product/pattern-product.entity';
import { MasterClassEntity } from './../master-class/master-class.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { SliderEntity } from './../slider/slider.entity';
import { PostEntity } from './../post/post.entity';
import { ProductOptionEntity } from '../product-option/product-option.entity';

@Entity({ name: 'files' })
export class FileUploadEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    name: 'file_url',
  })
  fileUrl!: string;

  @OneToMany(() => SliderEntity, (slider: SliderEntity) => slider.imageUrl)
  slider: SliderEntity[];

  @OneToOne(() => PostEntity, (res: PostEntity) => res.image, {
    onDelete: 'CASCADE',
    onUpdate: 'SET NULL',
  })
  @JoinColumn({
    name: 'post_id',
  })
  postId: PostEntity;

  @ManyToOne(
    () => MasterClassEntity,
    (masterClass: MasterClassEntity) => masterClass.images,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  @JoinColumn({
    name: 'master_class_id',
  })
  masterClassId: MasterClassEntity;

  @ManyToOne(
    () => SewingProductEntity,
    (sewingProduct: SewingProductEntity) => sewingProduct.images,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  @JoinColumn({
    name: 'sewing_product_id',
  })
  sewingProductId: SewingProductEntity;

  @ManyToOne(
    () => PatternProductEntity,
    (patternProduct: PatternProductEntity) => patternProduct.images,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  @JoinColumn({
    name: 'pattern_product_id',
  })
  patternProductId: PatternProductEntity;

  @ManyToOne(
    () => PatternProductEntity,
    (patternProduct: PatternProductEntity) => patternProduct.filesPdf,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  @JoinColumn({
    name: 'pattern_product_files_pdf',
  })
  productFilePdf: PatternProductEntity;

  @ManyToOne(
    () => ProductOptionEntity,
    (res: ProductOptionEntity) => res.filesPdf,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  @JoinColumn({
    name: 'pattern_option_files_pdf',
  })
  optionFilePdf: ProductOptionEntity;
}
