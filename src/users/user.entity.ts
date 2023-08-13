import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Advert } from '../advert/advert.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'varchar', nullable: false })
  userName: string;

  @Column('text', {
    unique: true,
    nullable: false,
  })
  email: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'int', nullable: true })
  age: number;

  @Column({ type: 'varchar', select: false, nullable: true })
  password: string;

  @Column({ default: 'User', nullable: false })
  role: string;

  @Column({ default: false, nullable: false })
  isPremium: boolean;

  @OneToMany(() => Advert, (entity) => entity.user) //FOR PREMIUM ACCOUNT
  @JoinColumn()
  adverts: Advert;
}
