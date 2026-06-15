import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HrRoomPage } from './hr-room.page';

const routes: Routes = [
  {
    path: '',
    component: HrRoomPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HrRoomPageRoutingModule {}
