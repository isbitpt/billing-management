import {
  NotificationTypeModel
} from '@isbit/render/core/modules/notification/models/notification-type.model';
import {Action} from '@ngrx/store';

export interface NotificationOptionsModel {
  title: string;
  message: string;
  type: NotificationTypeModel;
  cancelLabel?: string | null;
  cancelActions?: Action[] | null;
  confirmLabel?: string | null;
  nextActions?: Action[] | null;
}
