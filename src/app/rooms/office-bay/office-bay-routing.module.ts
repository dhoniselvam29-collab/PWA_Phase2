import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OfficeBayPage } from './office-bay.page';

const routes: Routes = [
  {
    path: '',
    component: OfficeBayPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OfficeBayPageRoutingModule {}
