import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';

@Entity({ name: 'user_info' })
export class UserInfoEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // @OneToOne(() => UserEntity, (user: UserEntity) => user.userSettingId)
  // @JoinColumn({
  //   name: 'user_id',
  // })
  // userId: UserEntity;

  @Column({
    type: 'varchar',
    name: 'full_name',
    nullable: true,
  })
  fullName: string;

  @Column({
    type: 'varchar',
    name: 'phone',
    nullable: true,
  })
  phone: string;

  @Column({ name: 'google_id', nullable: true })
  googleId: string;

  @Column({ name: 'apple_id', nullable: true })
  appleId: string;

  @Column({ name: 'facebook_id', nullable: true })
  facebookId: string;

  @Column({
    type: 'json',
    nullable: true,
  })
  country: {
    country: string;
    country_iso_code: string;
    label: string;
  };
  @Column({
    type: 'json',
    nullable: true,
  })
  city: {
    city: string;
    fias_id: string;
    fias_level: string;
    kladr_id: string;
    label: string;
    settlement: string;
  };
  @Column({
    type: 'json',
    nullable: true,
  })
  street: {
    fias_id: string;
    fias_level: string;
    label: string;
    street: string;
  };
  @Column({
    type: 'json',
    nullable: true,
  })
  house: {
    fias_id: string;
    fias_level: string;
    house: string;
    label: string;
  };
  @Column({
    type: 'json',
    nullable: true,
  })
  postal_code: {
    label: string;
    postal_code: string;
  };
  @Column({
    type: 'json',
    nullable: true,
  })
  address: {
    country: string;
    city: string;
    settlement: string;
    street: string;
    house: string;
    postal_code: string;
    kladr_id: string;
  };
}
