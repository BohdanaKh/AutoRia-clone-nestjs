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

  @Column({ type: 'varchar', nullable: false })
  city: string;

  @Column({ type: 'varchar', nullable: false })
  model: string;

  @Column({ type: 'varchar', nullable: false })
  brand: string;
  @Column('text')
  description: string;

  @Column()
  filename: string;

  @Column('int')
  views: number;

  @Column({ type: 'boolean' })
  isPublished: boolean;

  @Column({ type: 'int', nullable: false })
  price: number;

  @Column({ type: 'enum', enum: Currency })
  currency: Currency;

  // @OneToOne(() => User)
  // @JoinColumn()
  // user: User;

  @ManyToOne(() => User, (user) => user.advert) //FOR PREMIUM
  user: User;
}
