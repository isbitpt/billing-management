import {PushNotificationTypeModel} from './push-notification-type.model';

export interface PushNotificationOptionsModel {
  notificationType: PushNotificationTypeModel;
  message: string;
}
