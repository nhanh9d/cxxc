import { UserDto } from "./user";

export type ChatRoomDto = {
  id: number;
  name: string;
  roomId: string;
  type: string;
  metadata: Record<string, any>;
  members: ChatMember[];
  createdAt: Date;
  updatedAt: Date;
}

export type ChatMember = {
  id: number;
  user: UserDto;
  userId: number;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}
