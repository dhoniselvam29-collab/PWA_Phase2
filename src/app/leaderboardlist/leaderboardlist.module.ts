import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LeaderboardlistPageRoutingModule } from './leaderboardlist-routing.module';

import { LeaderboardlistPage } from './leaderboardlist.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LeaderboardlistPageRoutingModule,
    LeaderboardlistPage
  ],
})
export class LeaderboardlistPageModule {}
