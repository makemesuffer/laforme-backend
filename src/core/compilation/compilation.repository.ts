import { LangType } from 'src/common/enum/lang.enum';
import { EntityRepository, Repository } from 'typeorm';
import { CompilationEntity } from './compilation.entity';

@EntityRepository(CompilationEntity)
export class CompilationRepository extends Repository<CompilationEntity> {
  async findAll(lang: LangType, userId?: number): Promise<CompilationEntity[]> {
    const query = await this.createQueryBuilder('compilation')
      .leftJoin('compilation.compilationProducts', 'compilation_products')

      .leftJoin('compilation_products.masterClassId', 'com_master_class')
      .leftJoin('compilation_products.postId', 'com_post')
      .leftJoin('compilation_products.patternProductId', 'com_pattern_product')
      .leftJoin('compilation_products.sewingProductId', 'com_sewing_product')

      .leftJoin('com_master_class.images', 'com_master_class_images')
      .leftJoin('com_pattern_product.images', 'com_pattern_product_images')
      .leftJoin('com_sewing_product.images', 'com_sewing_product_images')
      .leftJoin('com_post.image', 'com_post_image')

      .leftJoin('com_pattern_product.options', 'com_pattern_product_options')
      .leftJoin('com_sewing_product.options', 'com_sewing_product_options')

      .select([
        'compilation.id',
        'compilation.title',
        'compilation.path',
        'compilation.inEnglish',
        'compilation_products.id',

        'com_master_class.id',
        'com_master_class.type',
        'com_master_class.vendorCode',
        'com_master_class.createdDate',
        'com_master_class.titleRu',
        'com_master_class.modifierRu',
        'com_master_class.discount',
        'com_master_class.price',
        'com_master_class.deleted',
        'com_master_class_images',

        'com_pattern_product.id',
        'com_pattern_product.type',
        'com_pattern_product.optionType',
        'com_pattern_product.titleRu',
        'com_pattern_product.modifierRu',
        'com_pattern_product.complexity',
        'com_pattern_product.vendorCode',
        'com_pattern_product.price',
        'com_pattern_product.discount',
        'com_pattern_product.count',
        'com_pattern_product.isCount',
        'com_pattern_product_images',
        'com_pattern_product.deleted',
        'com_pattern_product_options.id',
        'com_pattern_product_options.price',
        'com_pattern_product_options.discount',
        'com_pattern_product_options.size',
        'com_pattern_product_options.count',
        'com_pattern_product_options.vendorCode',

        'com_pattern_product.optionType',
        'com_pattern_product_options.optionVisibility',

        'com_sewing_product.id',
        'com_sewing_product.titleRu',
        'com_sewing_product.modifierRu',
        'com_sewing_product.type',
        'com_sewing_product.price',
        'com_sewing_product.discount',
        'com_sewing_product.optionType',
        'com_sewing_product.count',
        'com_sewing_product.isCount',
        'com_sewing_product.length',
        'com_sewing_product.isLength',
        'com_sewing_product_images',
        'com_sewing_product_options.id',
        'com_sewing_product_options.size',
        'com_sewing_product_options.colorRu',
        'com_sewing_product_options.price',
        'com_sewing_product_options.count',
        'com_sewing_product_options.length',
        'com_sewing_product_options.discount',
        'com_sewing_product_options.vendorCode',
        'com_sewing_product.deleted',
        'com_sewing_product.optionType',
        'com_sewing_product_options.optionVisibility',

        'com_post.id',
        'com_post.type',
        'com_post.titleRu',
        'com_post.modifierRu',
        'com_post.createdDate',
        'com_post.vendorCode',
        'com_post_image',
      ])
      .where('compilation.inEnglish = :lang', { lang: lang === 'en' });

    if (userId) {
      query
        .leftJoinAndSelect(
          'com_master_class.like',
          'com_master_class_like',
          'com_master_class_like.userId = :userId',
          {
            userId,
          },
        )
        .leftJoinAndSelect(
          'com_pattern_product.like',
          'com_pattern_product_like',
          'com_pattern_product_like.userId = :userId',
          {
            userId,
          },
        )
        .leftJoinAndSelect(
          'com_sewing_product.like',
          'com_sewing_product_like',
          'com_sewing_product_like.userId = :userId',
          {
            userId,
          },
        )
        .leftJoinAndSelect(
          'com_post.like',
          'com_post_like',
          'com_post_like.userId = :userId',
          {
            userId,
          },
        );
      //   .where(
      //     'com_master_class.deleted = false OR com_sewing_product.deleted = false OR com_pattern_product.deleted = false',
      //   )
    }
    return await query.getMany();
  }
}

// async findAll(): Promise<CompilationEntity[]> {
//     return await this.createQueryBuilder('compilation')
//       .leftJoin('compilation.compilationProducts', 'compilation_products')

//       .leftJoin('compilation_products.masterClassId', 'com_master_class')
//       .leftJoin('compilation_products.postId', 'com_post')
//       .leftJoin('compilation_products.patternProductId', 'com_pattern_product')
//       .leftJoin('compilation_products.sewingProductId', 'com_sewing_product')

//       .leftJoin('com_master_class.images', 'com_master_class_images')
//       .leftJoin('com_pattern_product.images', 'com_pattern_product_images')
//       .leftJoin('com_sewing_product.images', 'com_sewing_product_images')
//       .leftJoin('com_post.image', 'com_post_image')

//       .leftJoin('com_pattern_product.options', 'com_pattern_product_options')
//       .leftJoin('com_sewing_product.options', 'com_sewing_product_options')

//       .select([
//         'compilation.id',
//         'compilation.title',
//         'compilation.path',
//         'compilation.inEnglish',
//         'compilation_products.id',

//         'com_master_class.id',
//         'com_master_class.type',
//         'com_master_class.vendorCode',
//         'com_master_class.createdDate',
//         'com_master_class.titleRu',
//         'com_master_class.modifierRu',
//         'com_master_class.discount',
//         'com_master_class.deleted',
//         'com_master_class.price',
//         'com_master_class_images',

//         'com_pattern_product.id',
//         'com_pattern_product.type',
//         'com_pattern_product.optionType',
//         'com_pattern_product.titleRu',
//         'com_pattern_product.modifierRu',
//         'com_pattern_product.complexity',
//         'com_pattern_product.vendorCode',
//         'com_pattern_product.price',
//         'com_pattern_product.discount',
//         'com_pattern_product.count',
//         'com_pattern_product.isCount',
//         'com_pattern_product.deleted',
//         'com_pattern_product_images',
//         'com_pattern_product_options.id',
//         'com_pattern_product_options.price',
//         'com_pattern_product_options.discount',
//         'com_pattern_product_options.size',
//         'com_pattern_product_options.count',
//         'com_pattern_product_options.vendorCode',
//         'com_pattern_product.optionType',
//         'com_pattern_product_options.optionVisibility',

//         'com_sewing_product.id',
//         'com_sewing_product.titleRu',
//         'com_sewing_product.modifierRu',
//         'com_sewing_product.type',
//         'com_sewing_product.price',
//         'com_sewing_product.discount',
//         'com_sewing_product.optionType',
//         'com_sewing_product.count',
//         'com_sewing_product.isCount',
//         'com_sewing_product.length',
//         'com_sewing_product.deleted',
//         'com_sewing_product.isLength',
//         'com_sewing_product_images',
//         'com_sewing_product_options.id',
//         'com_sewing_product_options.size',
//         'com_sewing_product_options.colorRu',
//         'com_sewing_product_options.price',
//         'com_sewing_product_options.count',
//         'com_sewing_product_options.length',
//         'com_sewing_product_options.discount',
//         'com_sewing_product_options.vendorCode',
//         'com_sewing_product.optionType',
//         'com_sewing_product_options.optionVisibility',

//         'com_post.id',
//         'com_post.type',
//         'com_post.titleRu',
//         'com_post.modifierRu',
//         'com_post.createdDate',
//         'com_post.vendorCode',
//         'com_post_image',
//       ])
//       //   .where(
//       //     'com_master_class.deleted = false OR com_sewing_product.deleted = false OR com_pattern_product.deleted = false',
//       //   )
//       .getMany();
//   }
