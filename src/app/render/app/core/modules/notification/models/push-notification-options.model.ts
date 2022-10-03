import {
  PushNotificationTypeModel
} from '@isbit/render/core/modules/notification/models/push-notification-type.model';

export interface PushNotificationOptionsModel {
  notificationType: PushNotificationTypeModel;
  message: string;
}
