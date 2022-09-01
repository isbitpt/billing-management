import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StartingPointRoutingModule } from './starting-point-routing.module';
import {StartingPointComponent} from './starting-point.component';
import {FormsModule} from '@angular/forms';


@NgModule({
  declarations: [
    StartingPointComponent
  ],
  imports: [
    CommonModule,
    StartingPointRoutingModule,
    FormsModule
  ]
})
export class StartingPointModule { }
