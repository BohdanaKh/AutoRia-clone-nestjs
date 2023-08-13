import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import Role from './enum/user.role.enum';

@Entity()
export class Manager {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'varchar', nullable: false })
  userName: string;

  @Column('text', {
    unique: true,
    nullable: false,
  })
  email: string;

  @Column({ type: 'int', nullable: true })
  age: number;

  @Column({ type: 'varchar', select: false, nullable: true })
  password: string;

  @Column({ default: Role.Manager, nullable: false })
  role: Role[];
}
