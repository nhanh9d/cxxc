import { UserDto } from "./user";

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
}

export type EventRuleDto = {
  name: string;
  icon: string;
}

export type EventMember = {
  user: UserDto,
}

export type EventStatistic = {
  event: EventDto,
  members: EventMember[],
  invitedNo: number,
  rejectedNo: number,
}