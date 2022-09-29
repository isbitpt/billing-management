import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {StartingPointComponent} from './starting-point.component';

const routes: Routes = [
  {
    path: '',
    component: StartingPointComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class StartingPointRoutingModule { }
