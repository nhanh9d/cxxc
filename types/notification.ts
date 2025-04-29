export type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  content: string;
  metadata: Record<string, any>;
  isRead: boolean;
  isPushed: boolean;
  userId: number;
  createdAt: Date;
}

export enum NotificationType {
  EVENT_INVITATION = "EVENT_INVITATION",
  EVENT_UPDATE = "EVENT_UPDATE",
  EVENT_CANCEL = "EVENT_CANCEL",
  EVENT_MEMBER_JOINED = 'EVENT_MEMBER_JOINED',
  EVENT_MEMBER_LEFT = 'EVENT_MEMBER_LEFT',
  EVENT_FINISHED = 'EVENT_FINISHED',
}