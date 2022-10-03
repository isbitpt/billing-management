import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';

import * as models from '@isbit/render/core/modules/notification/models';

import * as notificationStore from '@isbit/render/core/modules/notification/store';


@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  public pushNotifications$ = this.store.select(notificationStore.selectPushNotifications);

  constructor(
    private store: Store
  ) {}

  public createPushNotification(options: models.PushNotificationOptionsModel): void {
    this.store.dispatch(notificationStore.CreatePushNotificationStartAction(options));
  }

  public createNotification(options: models.NotificationOptionsModel): void {

  }
}
