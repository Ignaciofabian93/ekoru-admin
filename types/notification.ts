import { type NotificationType, type NotificationPriority } from "./enums";

export type Notification = {
  id: number;
  sellerId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  priority: NotificationPriority;
  relatedId?: string | null;
  actionUrl?: string | null;
  metadata?: string | null;
  createdAt: Date;
  readAt?: Date | null;
};

export type NotificationTemplate = {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};
