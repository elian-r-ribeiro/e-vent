import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EventConfigPageRoutingModule } from './event-config-routing.module';

import { EventConfigPage } from './event-config.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EventConfigPageRoutingModule
  ],
  declarations: [EventConfigPage]
})
export class EventConfigPageModule {}
