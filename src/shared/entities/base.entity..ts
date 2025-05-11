import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../modules/users/entity/user.entity';

@Entity()
export class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.id, { nullable: true })
  createdBy: User;

  @ManyToOne(() => User, (user) => user.id, { nullable: true })
  updatedBy: User;

  @Column({ type: 'timestamp', nullable: true, default: null })
  deletedAt: Date;

  @ManyToOne(() => User, (user) => user.id, { nullable: true })
  deletedBy: User;

  @Column({ default: false })
  isDeleted: boolean;
}
