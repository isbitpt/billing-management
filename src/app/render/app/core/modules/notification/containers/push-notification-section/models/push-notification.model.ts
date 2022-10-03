import {
  PushNotificationTypeModel
} from '@isbit/render/core/modules/notification/models/push-notification-type.model';

export class PushNotificationModel {
  notificationType: PushNotificationTypeModel;
  message: string;
  rendered: boolean;
  id: string;
}
