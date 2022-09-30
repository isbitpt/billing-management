import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';


import {CoreModule} from '@isbit/render/core/core.module';
import {StartingPointRoutingModule} from './starting-point-routing.module';
import {AuthenticationModule} from '@isbit/render/core/modules/authentication/authentication.module';

import {CONTAINERS} from '@isbit/render/features/starting-point/containers';
import {StartingPointComponent} from '@isbit/render/features/starting-point/starting-point.component';
import {DialogModule} from '@angular/cdk/dialog';
import {ConfigurationModule} from '@isbit/render/core/modules/configuration/configuration.module';


@NgModule({
  id: 'isbit-starting-point-module',
  declarations: [
    ...CONTAINERS,
    StartingPointComponent
  ],
  imports: [
    FormsModule,
    DialogModule,
    AuthenticationModule,
    ConfigurationModule,
    CoreModule,
    ReactiveFormsModule,
    StartingPointRoutingModule
  ]
})
export class StartingPointModule { }
