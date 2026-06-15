import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReceptionRoomPage } from './reception-room.page';

const routes: Routes = [
  {
    path: '',
    component: ReceptionRoomPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReceptionRoomPageRoutingModule {}
