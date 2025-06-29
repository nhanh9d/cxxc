import { UserDto } from "./user";
import { ChatRoomDto } from "./chatRoom";
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
  invitedNo: number,
  rejectedNo: number,
  chatRoom: ChatRoomDto,
}