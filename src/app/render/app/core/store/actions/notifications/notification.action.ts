/* eslint-disable @typescript-eslint/naming-convention */

import {BaseAction} from '@isbit/render/core/store/actions/base-action';

export class NotificationAction extends BaseAction {
  public static ActionTypes = {
    ADD_NOTIFICATION: NotificationAction.type('ADD_NOTIFICATION'),
  };

  protected static getPrefix(): string {
    return 'UI Notification';
  };
}
