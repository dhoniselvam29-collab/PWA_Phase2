import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SuccessScreenPageRoutingModule } from './success-screen-routing.module';

import { SuccessScreenPage } from './success-screen.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SuccessScreenPageRoutingModule
  ],
  // declarations: [SuccessScreenPage]
})
export class SuccessScreenPageModule {}
