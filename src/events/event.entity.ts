import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

enum EventStatus {
  PENDING = 'Pending',
  ACCEPTED = 'Accepted',
  DECLINE = 'Declined',
}

enum EventType {
  REMOTEWORK = 'RemoteWork',
  PAIDLEAVE = 'PaidLeave',
}

@Entity()
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  date: Date;

  @Column({
    nullable: false,
    type: 'enum',
    enum: EventStatus,
    default: EventStatus.PENDING,
  })
  eventStatus: EventStatus;

  @Column({
    nullable: false,
    type: 'enum',
    enum: EventType,
  })
  eventType: EventType;

  @Column({ nullable: true })
  eventDescription: string;

  @Column('uuid', { nullable: true })
  userId: string;
}
