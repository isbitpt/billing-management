import {
  NotificationService
} from '@isbit/render/core/modules/notification/services/notification.service';
import {
  InternalNotificationService
} from '@isbit/render/core/modules/notification/services/internal-notification.service';

export * from './notification.service';

export const SERVICES = [
  NotificationService,
  InternalNotificationService
];
