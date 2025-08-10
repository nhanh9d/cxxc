import { UserDto } from "./user";
import { ChatRoomDto } from "./chatRoom";

export enum EventTarget {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE'
}

export enum EventMemberStatus {
  REGISTERED,
  INVITED,
  CONFIRMED,
  REJECTED,
}

export type EventDto = {
  id?: number;
  name?: string;
  banner?: string;
  startDate?: Date;
  endDate?: Date;
  startLocation?: string;
  description?: string;
  size?: number;
  members?: EventMember[],
  creator?: UserDto;
  rules?: EventRuleDto[];
  target?: EventTarget;
}

export type EventRuleDto = {
  name: string;
  icon: string;
}

export type EventMember = {
  user: UserDto,
  status: EventMemberStatus,
  registeredAt?: Date,
}

export type EventStatistic = {
  event: EventDto,
  invitedNo: number,
  rejectedNo: number,
  chatRoom: ChatRoomDto,
}
