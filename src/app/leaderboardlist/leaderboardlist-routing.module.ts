import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LeaderboardlistPage } from './leaderboardlist.page';

const routes: Routes = [
  {
    path: '',
    component: LeaderboardlistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LeaderboardlistPageRoutingModule {}
