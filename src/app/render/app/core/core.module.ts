import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {SERVICES} from '@isbit/render/core/services';
import {COMPONENTS} from '@isbit/render/core/components';

@NgModule({
  declarations: [
    ...COMPONENTS
  ],
  imports: [
    CommonModule
  ],
  providers: [
    ...SERVICES
  ],
  exports: [
    CommonModule,
    ...COMPONENTS
  ]
})
export class CoreModule { }
