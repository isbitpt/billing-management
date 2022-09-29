import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ManagementRoutingModule} from './management-routing.module';

import { ManagementComponent } from './management.component';
import {GUARDS} from '@isbit/render/features/management/guards';
import {AuthenticationModule} from '@isbit/render/core/modules/authentication/authentication.module';

@NgModule({
  id: 'isbit-management-module',
  declarations: [
    ManagementComponent
  ],
  imports: [
    CommonModule,
    AuthenticationModule,
    ManagementRoutingModule
  ],
  providers: [
    ...GUARDS
  ]
})
export class ManagementModule { }
