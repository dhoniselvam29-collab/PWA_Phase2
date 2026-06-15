import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReceptionRoomPageRoutingModule } from './reception-room-routing.module';

import { ReceptionRoomPage } from './reception-room.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReceptionRoomPageRoutingModule,
    ReceptionRoomPage
  ],
})
export class ReceptionRoomPageModule {}
