import {createFeatureSelector, createSelector} from '@ngrx/store';
import {notificationFeatureKey, NotificationState} from '@isbit/render/core/modules/notification/store';

const selectState = createFeatureSelector<NotificationState>(notificationFeatureKey);

export const selectPushNotifications = createSelector(selectState, state => state.pushNotifications);
export const selectCanRender = createSelector(selectState, state => state.canRender);
