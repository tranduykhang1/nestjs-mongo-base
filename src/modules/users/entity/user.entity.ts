import { BaseEntity } from 'src/shared/entities/base.entity.';
import { USER_ROLE } from 'src/shared/enums/user.enum';
import { Column, Entity } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @Column({ length: 30 })
  firstName: string;

  @Column({ length: 30 })
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  key: string;

  @Column({ length: 255 })
  password: string;

  @Column({ type: 'enum', enum: USER_ROLE, default: USER_ROLE.USER })
  role: USER_ROLE;

  @Column({ type: 'timestamp', nullable: true, default: null })
  lastActivity: Date;
}
