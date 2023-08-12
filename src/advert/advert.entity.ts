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

@Entity()
@Unique(['id', 'brand', 'model', 'year'])
export class Advert {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  year: number;

  @Column({ type: 'int', nullable: false })
  priceUAH: number;

  @Column({ type: 'simple-json', nullable: false })
  priceUSD: { rate: number; price: number };

  @Column({ type: 'simple-json', nullable: false })
  priceEUR: { rate: number; price: number };

  // @Column({ type: 'enum', enum: Currency, nullable: false })
  // currency: Currency;

  @Column({ type: 'float' })
  exchangeRate: number;

  @Column({ type: 'float', update: false })
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

  @ManyToOne(() => User, (entity) => entity.adverts)//FOR PREMIUM

  user: User;
}
