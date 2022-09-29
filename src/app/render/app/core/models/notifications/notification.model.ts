import {NotificationTypeModel} from '@isbit/render/core/models/notifications/notification-type.model';
import {Action} from '@ngrx/store';

export class NotificationModel {
  public id: string;
  public type: NotificationTypeModel;
  public message: string;
  public header?: string;
  public toast = true;
  public nextActions?: Action[];
}
