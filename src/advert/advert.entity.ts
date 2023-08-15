import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { User } from '../users/user.entity';

@Entity()
@Unique(['id', 'brand', 'model'])
export class Advert {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { nullable: true, default: '0000' })
  year: string;

  @Column({ type: 'int', nullable: true, default: 1.0 })
  priceUAH: number;

  @Column({ type: 'simple-json' })
  priceUSD: { rate: number; price: number };

  @Column({ type: 'simple-json' })
  priceEUR: { rate: number; price: number };

  @Column({ type: 'float', update: false })
  userSpecifiedPrice: number;

  @Column({ type: 'varchar', nullable: true, default: '' })
  categories: string;

  @Column({ type: 'varchar', nullable: true, default: '' })
  brand: string;

  @Column({ type: 'varchar', nullable: true, default: '' })
  model: string;

  @Column({ type: 'varchar', nullable: true, default: '' })
  modification: string;

  @Column({ type: 'varchar', nullable: true, default: '' })
  body: string;

  @Column({ type: 'int', nullable: true, default: 1.0 })
  mileage: number;

  @Column({ type: 'varchar', nullable: true, default: '' })
  region: string;

  @Column({ type: 'varchar', nullable: true, default: '' })
  city: string;

  @Column({ type: 'varchar' })
  photo: string;

  @Column('timestamp', { array: true, default: [] })
  views: Date[];

  @Column({ type: 'boolean', default: true })
  isPublished: boolean;

  @ManyToOne(() => User, (entity) => entity.adverts)
  @JoinColumn()
  user: User;
}
