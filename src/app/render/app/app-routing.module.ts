import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('@isbit/render/features/starting-point/starting-point.module').then(m => m.StartingPointModule)
  },
  {
    path: 'management',
    loadChildren: () => import('@isbit/render/features/management/management.module').then(m => m.ManagementModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      relativeLinkResolution: 'legacy',
      useHash: true
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
