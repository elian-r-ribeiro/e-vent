import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ParticipantInfoPageRoutingModule } from './participant-info-routing.module';

import { ParticipantInfoPage } from './participant-info.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ParticipantInfoPageRoutingModule
  ],
  declarations: [ParticipantInfoPage]
})
export class ParticipantInfoPageModule {}
