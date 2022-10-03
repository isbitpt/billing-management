import produce from 'immer';
import {Action, createFeature, createReducer, on} from '@ngrx/store';

import * as notificationStore from '@isbit/render/core/modules/notification/store';
import * as models from '@isbit/render/core/modules/notification/models';

export const notificationFeatureKey = 'notifications';

export interface NotificationState {
  canRender: boolean;
  pushNotifications: models.PushNotificationModel[];
}

const initialState: NotificationState = {
  canRender: true,
  pushNotifications: []
};

const reducer = createReducer(
  initialState,
  on(notificationStore.CreatePushNotificationCompleteAction, (state, pl): NotificationState => {
    const payload = pl as notificationStore.CreatePushNotificationCompletePayload;

    return produce(state, draft => {
      draft.pushNotifications.push({
        rendered: payload.rendered,
        message: payload.message,
        notificationType: payload.notificationType,
        id: payload.id
      });
    });
  }),
  on(notificationStore.ToggleCanRenderAction, (state, pl): NotificationState => {
    const payload = pl as notificationStore.ToggleCanRenderPayload;

    return produce(state, draft => {
      draft.canRender = payload.state;
    });
  }),
  on(notificationStore.SetPushNotificationRenderedCompleteAction, (state, pl): NotificationState => {
    const payload = pl as notificationStore.SetPushNotificationRenderedCompletePayload;

    return produce(state, draft => {
      const index = draft.pushNotifications.findIndex(notification => notification.id === payload.id);
      if (index !== -1) {
        draft.pushNotifications[index] = {
          id: payload.id,
          notificationType: payload.notificationType,
          message: payload.message,
          rendered: payload.rendered
        };
      }
    });
  }),
  on(notificationStore.RemovePushNotificationAction, (state, pl): NotificationState => {
    const payload = pl as notificationStore.RemovePushNotificationPayload;

    return produce(state, draft => {
      const index = draft.pushNotifications.findIndex(notification => notification.id === payload.id);
      if (index !== -1) {
        draft.pushNotifications.splice(index, 1);
      }
    });
  }),
);

export const notificationFeature = createFeature({
  name: notificationFeatureKey,
  reducer: (state: NotificationState = initialState, action: Action) => reducer(state, action),
});
