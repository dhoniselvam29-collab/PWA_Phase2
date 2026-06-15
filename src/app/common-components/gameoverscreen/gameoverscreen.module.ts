import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GameoverscreenPageRoutingModule } from './gameoverscreen-routing.module';

import { GameoverscreenPage } from './gameoverscreen.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GameoverscreenPageRoutingModule
  ],
  // declarations: [GameoverscreenPage]
})
export class GameoverscreenPageModule {}
