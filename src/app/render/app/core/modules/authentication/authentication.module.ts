import { NgModule } from '@angular/core';
import {StoreModule} from '@ngrx/store';

import {CoreModule} from '@isbit/render/core/core.module';
import {EffectsModule} from '@ngrx/effects';

import {SERVICES} from '@isbit/render/core/modules/authentication/services';

import * as store from './store';

@NgModule({
  id: 'isbit-authentication',
  declarations: [],
  imports: [
    EffectsModule.forFeature(store.EFFECTS),
    StoreModule.forFeature(store.authenticationFeature),
    CoreModule
  ],
  providers: [
    ...SERVICES
  ]
})
export class AuthenticationModule { }
