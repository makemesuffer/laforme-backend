import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { MasterClassEntity } from '../master-class/master-class.entity';
import { PatternProductEntity } from '../pattern-product/pattern-product.entity';
import { SewingProductEntity } from '../sewing-product/sewing-product.entity';
import { PostEntity } from '../post/post.entity';
import { CompilationEntity } from '../compilation/compilation.entity';

@Entity({ name: 'compilation-product' })
export class CompilationProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({
    name: 'created_date',
    readonly: true,
  })
  createdDate: Date;

  @ManyToOne(
    () => CompilationEntity,
    (res: CompilationEntity) => res.compilationProducts,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({
    name: 'compilation_id',
  })
  compilation: CompilationEntity;

  @ManyToOne(
    () => MasterClassEntity,
    (res: MasterClassEntity) => res.compilationProduct,
  )
  @JoinColumn({
    name: 'master_class_id',
  })
  masterClassId: MasterClassEntity;

  @ManyToOne(
    () => PatternProductEntity,
    (res: PatternProductEntity) => res.compilationProduct,
  )
  @JoinColumn({
    name: 'pattern_product_id',
  })
  patternProductId: PatternProductEntity;

  @ManyToOne(
    () => SewingProductEntity,
    (res: SewingProductEntity) => res.compilationProduct,
  )
  @JoinColumn({
    name: 'sewing_product_id',
  })
  sewingProductId: SewingProductEntity;

  @ManyToOne(() => PostEntity, (res: PostEntity) => res.compilationProduct)
  @JoinColumn({
    name: 'post_id',
  })
  postId: PostEntity;
}
