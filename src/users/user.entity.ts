import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum Roles {
  EMPLOYEE = 'Employee',
  ADMIN = 'Admin',
  PROJECTMANAGER = 'ProjectManager',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: false })
  username: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({
    nullable: false,
    type: 'enum',
    enum: Roles,
    default: Roles.EMPLOYEE,
  })
  role: Roles;
}
