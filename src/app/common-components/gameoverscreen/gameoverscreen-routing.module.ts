import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GameoverscreenPage } from './gameoverscreen.page';

const routes: Routes = [
  {
    path: '',
    component: GameoverscreenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GameoverscreenPageRoutingModule {}
