import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';

import * as notificationStore from '@isbit/render/core/modules/notification/store';
import {RemovePushNotificationAction} from '@isbit/render/core/modules/notification/store';


@Injectable({
  providedIn: 'root'
})
export class InternalNotificationService {

  public canRender$ = this.store.select(notificationStore.selectCanRender);
  public pushNotifications$ = this.store.select(notificationStore.selectPushNotifications);

  constructor(
    private store: Store
  ) {}

  public toggleAllowRender(state: boolean): void {
    this.store.dispatch(notificationStore.ToggleCanRenderAction({state}));
  }

  public setNotificationRendered(id: string) {
    this.store.dispatch(notificationStore.SetPushNotificationRenderedStartAction({id}));
  }

  public removePushNotification(id: string) {
    this.store.dispatch(notificationStore.RemovePushNotificationAction({id}));
  }
}
