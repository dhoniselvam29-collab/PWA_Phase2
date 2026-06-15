import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HrRoomPageRoutingModule } from './hr-room-routing.module';

import { HrRoomPage } from './hr-room.page';
import { SettingsComponent } from 'src/app/settings/settings.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HrRoomPageRoutingModule,
    HrRoomPage,
    SettingsComponent
  ],
  // declarations: [HrRoomPage, SettingsComponent]
})
export class HrRoomPageModule {}
