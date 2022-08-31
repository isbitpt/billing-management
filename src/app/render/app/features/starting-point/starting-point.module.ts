import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StartingPointRoutingModule } from './starting-point-routing.module';
import {StartingPointComponent} from './starting-point.component';


@NgModule({
  declarations: [
    StartingPointComponent
  ],
  imports: [
    CommonModule,
    StartingPointRoutingModule
  ]
})
export class StartingPointModule { }
