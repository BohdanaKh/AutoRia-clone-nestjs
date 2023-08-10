import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Advert } from '../advert/advert.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'varchar', nullable: false })
  userName: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  email: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'int', nullable: true })
  age: number;

  @Column({ type: 'varchar', nullable: false })
  password: string;

  @Column({ default: 'User' })
  role: string;

  @Column({ default: false, nullable: false })
  isPremium: boolean;

  @OneToOne(() => Advert) //FOR SIMPLE ACCOUNT
  @JoinColumn()
  advert: Advert;

  @OneToMany(() => Advert, (entity) => entity.user, { cascade: true }) //FOR PREMIUM ACCOUNT
  @JoinColumn()
  adverts: Advert[];
}
