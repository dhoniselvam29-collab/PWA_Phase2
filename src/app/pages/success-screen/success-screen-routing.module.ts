import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SuccessScreenPage } from './success-screen.page';

const routes: Routes = [
  {
    path: '',
    component: SuccessScreenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SuccessScreenPageRoutingModule {}
