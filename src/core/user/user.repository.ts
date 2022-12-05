import { Repository, EntityRepository, Brackets } from 'typeorm';
import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { USER_ERROR } from './enum/user-error.enum';
import { UserEntity } from './user.entity';
import { CreateGoogleUseDto } from './dto/create-user-google.dto';
import { CreateFacebookUseDto } from './dto/create-user-facebook.dto';
import { CreateAppleUseDto } from './dto/create-user-apple.dto';
import { USER_ROLE } from './enum/user-role.enum';
import { UserSignUpDto } from '../auth/dto/user-sign-up.dto';
import { UserRecoveryChangeCredentialsDto } from '../user-recovery/dto/user-recovery-change-password.dto';
import { usersFindParamsDto } from './dto/users-find-params.dto';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  async createUser(data: UserSignUpDto): Promise<UserEntity> {
    const { login, email, password } = data;

    const isExistByLogin = await this.findOne({ login });

    if (isExistByLogin) {
      throw new ConflictException(USER_ERROR.LOGIN_ALREADY_TAKEN);
    }

    const isExistByEmail = await this.findOne({ email });

    if (isExistByEmail) {
      throw new ConflictException(USER_ERROR.EMAIL_ALREADY_TAKEN);
    }

    try {
      const user: UserEntity = new UserEntity();
      user.login = login;
      user.email = email;
      user.password = await UserEntity.hashPassword(password);
      await user.save();
      return user;
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  async getProfile(userId: number) {
    return await this.createQueryBuilder('user')
      .leftJoin('user.purchase', 'purchases')
      .leftJoin('user.comment', 'comments')
      .leftJoin('user.like', 'likes')
      .leftJoin('likes.postId', 'like_post')
      .leftJoin('like_post.image', 'like_post_image')

      .leftJoin('likes.sewingProductId', 'like_sewing_good')
      .leftJoin('like_sewing_good.images', 'like_sewing_good_images')

      .leftJoin('likes.patternProductId', 'like_pattern_product')
      .leftJoin('like_pattern_product.images', 'like_pattern_product_images')

      .leftJoin('likes.masterClassId', 'like_master_class')
      .leftJoin('like_master_class.images', 'like_master_class_images')

      .leftJoin('comments.postId', 'comment_post')
      .leftJoin('comment_post.image', 'comment_post_image')

      .leftJoin('comments.sewingProductId', 'comment_sewing_good')
      .leftJoin('comment_sewing_good.images', 'comment_sewing_good_images')

      .leftJoin('comments.patternProductId', 'comment_pattern_product')
      .leftJoin(
        'comment_pattern_product.images',
        'comment_pattern_product_images',
      )

      .leftJoin('comments.masterClassId', 'comment_master_class')
      .leftJoin('comment_master_class.images', 'comment_master_class_images')

      .select([
        'user.id',
        'user.login',
        'user.email',
        'user.role',
        'user.emailConfirmed',
        'user.notificationEmail',
        'user.createDate',
        'user.firstName',
        'user.lastName',
        'user.address',
        'user.phone',

        'likes',
        'like_post',
        'like_post_image.fileUrl',
        'like_sewing_good',
        'like_sewing_good_images.fileUrl',
        'like_pattern_product',
        'like_pattern_product_images.fileUrl',
        'like_master_class',
        'like_master_class_images.fileUrl',

        'comments',
        'comment_post',
        'comment_post_image',
        'comment_sewing_good',
        'comment_sewing_good_images',
        'comment_pattern_product',
        'comment_pattern_product_images',
        'comment_master_class',
        'comment_master_class_images',

        'purchases',
      ])
      .loadRelationCountAndMap(
        'purchases.purchaseProductsCount',
        'purchases.purchaseProducts',
      )
      .where('user.id = :id', { id: userId })
      .getOne();
  }

  async getAll(params: usersFindParamsDto): Promise<[UserEntity[], number]> {
    const { skip, take, sort, by, where, role } = params;
    const query = await this.createQueryBuilder('user')
      .select([
        'user.id',
        'user.login',
        'user.role',
        'user.emailConfirmed',
        'user.receivesNewOrders',
        'user.notificationEmail',
        'user.googleId',
        'user.appleId',
        'user.facebookId',
        'user.createDate',
      ])
      .where('user.id is not null');

    if (skip) {
      query.skip(skip);
    }
    if (take) {
      query.take(take);
    }

    if (sort && by) {
      query.orderBy(sort, by);
    }

    if (role) {
      query.andWhere('user.role = :role', {
        role: role,
      });
    }

    if (where) {
      query.andWhere(
        new Brackets((query) => {
          query
            .where('user.login ILIKE :where', {
              where: `%${where}%`,
            })
            .orWhere('user.email ILIKE :where', {
              where: `%${where}%`,
            });
        }),
      );
    }

    return await query.getManyAndCount();
  }

  async getUsersForEmailNotification(): Promise<UserEntity[]> {
    return await this.createQueryBuilder('user')
      .select(['user.id', 'user.email'])
      .where('user.id is not null')
      .andWhere('user.notificationEmail is true')
      .getMany();
  }

  async changePassword(
    user: UserEntity,
    data: UserRecoveryChangeCredentialsDto,
  ): Promise<void> {
    const { password } = data;

    user.password = await UserEntity.hashPassword(password);

    try {
      await user.save();
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  async confirmEmailById(user: UserEntity): Promise<UserEntity> {
    user.emailConfirmed = true;
    user.notificationEmail = true;
    try {
      await user.save();
      return user;
    } catch (err) {
      throw new BadRequestException();
    }
  }

  async saveGoogleUser(body: CreateGoogleUseDto): Promise<UserEntity> {
    const user: UserEntity = new UserEntity();
    user.googleId = body.googleId;
    user.login = body.login;
    user.email = body.email;
    user.emailConfirmed = true;
    try {
      await user.save();
      return user;
    } catch (err) {
      if (err.code === '23505') {
        throw new ConflictException(USER_ERROR.USER_ALREADY_EXISTS);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async saveAppleUser(body: CreateAppleUseDto): Promise<UserEntity> {
    const user: UserEntity = new UserEntity();
    user.appleId = body.appleId;
    user.login = body.login;
    user.email = body.email;

    try {
      await user.save();
      return user;
    } catch (err) {
      if (err.code === '23505') {
        throw new ConflictException(USER_ERROR.USER_ALREADY_EXISTS);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async saveFacebookUser(body: CreateFacebookUseDto): Promise<UserEntity> {
    const user: UserEntity = new UserEntity();
    user.facebookId = body.facebookId;
    user.login = body.login;
    user.email = body.email;

    try {
      await user.save();
      return user;
    } catch (err) {
      if (err.code === '23505') {
        throw new ConflictException(USER_ERROR.USER_ALREADY_EXISTS);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async getAdminsToNotificationNewOrder(): Promise<UserEntity[]> {
    return await this.createQueryBuilder('user')
      .select(['user.id', 'user.email', 'user.role'])
      .where('user.receivesNewOrders = true')
      .andWhere('user.role = :role', { role: USER_ROLE.SUPER })
      .getMany();
  }

  async statistics(from: Date, to: Date): Promise<any[]> {
    const role = USER_ROLE.USER;
    return await this.createQueryBuilder('user')
      .where('user.createDate >= :from', { from })
      .andWhere('user.createDate <= :to', { to })
      .andWhere('user.role = :role', { role })
      .getMany();
  }
}
