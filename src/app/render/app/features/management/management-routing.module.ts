import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import { ManagementComponent } from './management.component';
import {CanNavigateGuard} from '@isbit/render/features/management/guards/can-navigate.guard';

const routes: Routes = [
  {
    path: ':databaseId',
    component: ManagementComponent,
    canActivate: [CanNavigateGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ManagementRoutingModule { }
