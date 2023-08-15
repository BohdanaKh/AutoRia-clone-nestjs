import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Advert } from '../advert/advert.entity';
import { Account } from './enum/account-type.enum';
import { Role } from './enum/role.enum';

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

  @Column({ type: 'enum', enum: Role, default: Role.USER, nullable: true })
  role: Role;

  @Column({
    type: 'enum',
    enum: Account,
    default: Account.BASE,
  })
  account: Account;

  @OneToMany(() => Advert, (entity) => entity.user)
  @JoinColumn()
  adverts: Advert[];
}
