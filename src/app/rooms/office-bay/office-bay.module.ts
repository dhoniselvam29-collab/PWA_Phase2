import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OfficeBayPageRoutingModule } from './office-bay-routing.module';

import { OfficeBayPage } from './office-bay.page';
import { SettingsComponent } from 'src/app/settings/settings.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OfficeBayPageRoutingModule,
    SettingsComponent
  ],
  declarations: [OfficeBayPage]
})
export class OfficeBayPageModule {}
