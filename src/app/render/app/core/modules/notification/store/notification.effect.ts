import {Injectable} from '@angular/core';
import {Actions, concatLatestFrom, createEffect, ofType} from '@ngrx/effects';
import {filter, map, of} from 'rxjs';
import {mergeMap} from 'rxjs/operators';
import {v4 as uuid4} from 'uuid';

import * as NotificationActions from '@isbit/render/core/modules/notification/store/notification.action';
import {
  InternalNotificationService
} from '@isbit/render/core/modules/notification/services/internal-notification.service';

@Injectable()
export class NotificationEffect {

  public createPushNotificationStartAction$ = createEffect(() => this.actions$
    .pipe(
      ofType(NotificationActions.NotificationAction.ActionTypes.CREATE_PUSH_NOTIFICATION_START_ACTION),
      mergeMap((a: any) => of(({
        type: a.type,
        payload: a as NotificationActions.CreatePushNotificationStartPayload
      }))),
      map(action => {
        const newPushNotification: NotificationActions.CreatePushNotificationCompletePayload = {
          message: action.payload.message,
          notificationType: action.payload.notificationType,
          rendered: false,
          id: uuid4()
        };

        return NotificationActions.CreatePushNotificationCompleteAction(newPushNotification);
      })
    ));

  public setNotificationRenderedStart = createEffect(() => this.actions$
    .pipe(
      ofType(NotificationActions.NotificationAction.ActionTypes.SET_PUSH_NOTIFICATION_RENDERED_START_ACTION),
      mergeMap((a: any) => of(({
        type: a.type,
        payload: a as NotificationActions.SetPushNotificationRenderedStartPayload
      }))),
      concatLatestFrom(() => [
        this.internalNotificationService.pushNotifications$
      ]),
      map(([action, notifications]) => ({
        action,
        notifications
      })),
      map(data => {
        const currentNotification = data.notifications.find(notification => notification.id === data.action.payload.id);

        const newPushNotification: NotificationActions.SetPushNotificationRenderedCompletePayload = {
          message: currentNotification.message,
          notificationType: currentNotification.notificationType,
          rendered: true,
          id: currentNotification.id
        };

        return NotificationActions.SetPushNotificationRenderedCompleteAction(newPushNotification);
      })
    ));

  constructor(
    private actions$: Actions,
    private internalNotificationService: InternalNotificationService
  ) {}
}
