/* eslint-disable @typescript-eslint/naming-convention */
import {BaseAction} from '@isbit/render/core/store/actions/base-action';
import {createAction, props} from '@ngrx/store';

import * as models from '@isbit/render/core/modules/notification/models';

export class NotificationAction extends BaseAction {
  public static ActionTypes = {
    CREATE_PUSH_NOTIFICATION_START_ACTION: NotificationAction.type('CREATE_PUSH_NOTIFICATION_START_ACTION'),
    CREATE_PUSH_NOTIFICATION_COMPLETE_ACTION: NotificationAction.type('CREATE_PUSH_NOTIFICATION_COMPLETE_ACTION'),

    TOGGLE_CAN_RENDER_ACTION: NotificationAction.type('TOGGLE_CAN_RENDER_ACTION'),

    SET_PUSH_NOTIFICATION_RENDERED_START_ACTION: NotificationAction.type('SET_PUSH_NOTIFICATION_RENDERED_START_ACTION'),
    SET_PUSH_NOTIFICATION_RENDERED_COMPLETE_ACTION: NotificationAction.type('SET_PUSH_NOTIFICATION_RENDERED_COMPLETE_ACTION'),

    REMOVE_PUSH_NOTIFICATION_ACTION: NotificationAction.type('REMOVE_PUSH_NOTIFICATION_ACTION'),
  };

  protected static getPrefix(): string {
    return 'Notification';
  };
}

export interface CreatePushNotificationStartPayload {
  notificationType: models.PushNotificationTypeModel;
  message: string;
}

export const CreatePushNotificationStartAction = createAction(
  NotificationAction.ActionTypes.CREATE_PUSH_NOTIFICATION_START_ACTION,
  props<CreatePushNotificationStartPayload>()
);


export interface CreatePushNotificationCompletePayload {
  notificationType: models.PushNotificationTypeModel;
  message: string;
  rendered: boolean;
  id: string;
}

export const CreatePushNotificationCompleteAction = createAction(
  NotificationAction.ActionTypes.CREATE_PUSH_NOTIFICATION_COMPLETE_ACTION,
  props<CreatePushNotificationCompletePayload>()
);

export interface ToggleCanRenderPayload {
  state: boolean;
}

export const ToggleCanRenderAction = createAction(
  NotificationAction.ActionTypes.TOGGLE_CAN_RENDER_ACTION,
  props<ToggleCanRenderPayload>()
);

export interface SetPushNotificationRenderedStartPayload {
  id: string;
}

export const SetPushNotificationRenderedStartAction = createAction(
  NotificationAction.ActionTypes.SET_PUSH_NOTIFICATION_RENDERED_START_ACTION,
  props<SetPushNotificationRenderedStartPayload>()
);

export interface SetPushNotificationRenderedCompletePayload {
  notificationType: models.PushNotificationTypeModel;
  message: string;
  rendered: boolean;
  id: string;
}

export const SetPushNotificationRenderedCompleteAction = createAction(
  NotificationAction.ActionTypes.SET_PUSH_NOTIFICATION_RENDERED_COMPLETE_ACTION,
  props<SetPushNotificationRenderedCompletePayload>()
);

export interface RemovePushNotificationPayload {
  id: string;
}

export const RemovePushNotificationAction = createAction(
  NotificationAction.ActionTypes.REMOVE_PUSH_NOTIFICATION_ACTION,
  props<RemovePushNotificationPayload>()
);
