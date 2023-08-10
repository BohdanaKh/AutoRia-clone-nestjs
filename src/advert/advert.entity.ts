import {
  Column,
  Entity,
  // JoinColumn,
  ManyToOne,
  // OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '../users/user.entity';
import Currency from './currency.enum';

@Entity()
export class Advert {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  year: number;

  @Column({ type: 'int', nullable: false })
  price: number;

  @Column({ type: 'enum', enum: Currency, nullable: false })
  currency: Currency;

  @Column({ type: 'varchar', nullable: false })
  categories: string;

  @Column({ type: 'varchar', nullable: false })
  brand: string;

  @Column({ type: 'varchar', nullable: false })
  model: string;

  @Column({ type: 'varchar', nullable: false })
  modification: string;

  @Column({ type: 'varchar', nullable: false })
  body: string;

  @Column({ type: 'int', nullable: false })
  mileage: number;

  @Column({ type: 'varchar', nullable: false })
  region: string;

  @Column({ type: 'varchar', nullable: false })
  city: string;

  @Column({ type: 'varchar' })
  photo: string;

  @Column('timestamp', { array: true, default: [] })
  views: Date[];

  @Column({ type: 'boolean', default: false })
  isPublished: boolean;

  // @OneToOne(() => User)
  // @JoinColumn()
  // user: User;

  @ManyToOne(() => User, (user) => user.advert) //FOR PREMIUM
  user: User;
}
