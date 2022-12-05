import {
  Entity,
  Unique,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import {
  generatePasswordSalt,
  generateBcryptHash,
} from '../../common/utils/hash';
import { USER_ROLE } from './enum/user-role.enum';
import { PurchaseEntity } from '../purchase/purchase.entity';
import { CommentEntity } from '../comment/comment.entity';
import { LikeEntity } from '../like/like.entity';
import { Transform } from 'class-transformer';

@Entity({ name: 'user' })
@Unique(['login', 'email'])
export class UserEntity extends BaseEntity {
  static async hashPassword(password: string): Promise<string> {
    const salt = await generatePasswordSalt(password);
    return generateBcryptHash(password, salt);
  }

  async validatePassword(password: string): Promise<boolean> {
    const salt = await generatePasswordSalt(password);
    const hashPassword = generateBcryptHash(password, salt);
    return this.password === hashPassword;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createDate: string;

  @Column({ name: 'google_id', nullable: true })
  googleId?: string;

  @Column({ name: 'facebook_id', nullable: true })
  facebookId?: string;

  @Column({ name: 'apple_id', nullable: true })
  appleId?: string;

  @Column({ unique: true, nullable: true })
  @Transform((value) => value.trim())
  @Transform((value) => value.toLowerCase())
  login: string;

  @Column({ unique: true, nullable: true })
  @Transform((value: string) => value?.trim())
  email: string;

  @Column({ nullable: true })
  @Transform((value: string) => value?.trim())
  password: string;

  @Column({
    type: 'varchar',
    name: 'last_name',
    nullable: true,
  })
  lastName: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  phone: string;

  @Column({
    type: 'json',
    nullable: true,
  })
  address: {
    value: string;
    unrestricted_value: object;
  };

  @Column({ default: false })
  emailConfirmed: boolean;

  @Column({ default: true })
  notificationEmail: boolean;

  @Column({ default: false })
  receivesNewOrders: boolean;

  @Column({
    type: 'enum',
    enum: USER_ROLE,
    default: USER_ROLE.USER,
  })
  role: USER_ROLE;

  @OneToMany(() => LikeEntity, (like: LikeEntity) => like.userId)
  like: LikeEntity[];

  @OneToMany(
    () => PurchaseEntity,
    (purchase: PurchaseEntity) => purchase.userId,
    {
      onDelete: 'CASCADE',
    },
  )
  purchase: PurchaseEntity[];

  @OneToMany(() => CommentEntity, (comment: CommentEntity) => comment.userId, {
    onDelete: 'CASCADE',
  })
  comment: CommentEntity[];
}
