import {
  Column,
  Entity,
  // JoinColumn,
  ManyToOne,
  // OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { User } from '../users/user.entity';
import Currency from './interface/currency.enum';

@Entity()
@Unique(['id', 'brand', 'model', 'year'])
export class Advert {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  year: number;

  @Column({ type: 'int', nullable: false })
  priceUAH: number;

  @Column({ type: 'int', nullable: false })
  priceUSD: number;

  @Column({ type: 'int', nullable: false })
  priceEUR: number;

  // @Column({ type: 'enum', enum: Currency, nullable: false })
  // currency: Currency;

  @Column({ type: 'float' })
  exchangeRate: number;

  @Column({ type: 'float' })
  userSpecifiedPrice: number;

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
