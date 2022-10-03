import { NgModule } from '@angular/core';
import {StoreModule} from '@ngrx/store';

import {CoreModule} from '@isbit/render/core/core.module';
import {EffectsModule} from '@ngrx/effects';

import * as store from './store';

import {SERVICES} from '@isbit/render/core/modules/notification/services';
import {CONTAINERS} from '@isbit/render/core/modules/notification/containers';
import {COMPONENTS} from '@isbit/render/core/modules/notification/components';
import {
  PushNotificationSectionComponent
} from '@isbit/render/core/modules/notification/containers/push-notification-section';

@NgModule({
  id: 'isbit-notification',
  declarations: [
    ...COMPONENTS,
    ...CONTAINERS
  ],
  imports: [
    EffectsModule.forFeature(store.EFFECTS),
    StoreModule.forFeature(store.notificationFeature),
    CoreModule
  ],
  exports: [
    PushNotificationSectionComponent
  ],
  providers: [
    ...SERVICES
  ]
})
export class NotificationModule { }
