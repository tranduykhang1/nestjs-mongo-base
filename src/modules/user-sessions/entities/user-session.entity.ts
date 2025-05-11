import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/modules/users/entity/user.entity';
import { BaseEntity } from 'src/shared/entities/base.entity.';
import { Column, Entity, Index, ManyToOne } from 'typeorm';

@Entity('user_sessions')
@Index(['userId'], { unique: true })
export class UserSession extends BaseEntity {
  @ApiProperty({ type: String })
  @Column({ type: 'uuid', nullable: false })
  userId: string;

  @ApiProperty({ type: String })
  @Column({ type: 'text', unique: true, default: () => 'CURRENT_TIMESTAMP' })
  session: string;

  @ApiProperty({ type: Boolean })
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @ApiProperty({ type: String })
  @Column({ type: 'text', nullable: false })
  refreshToken: string;

  @ApiProperty({ type: User })
  @ManyToOne(() => User, (user) => user.id, { nullable: true })
  user?: User;
}
