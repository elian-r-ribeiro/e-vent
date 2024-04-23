import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditeventPageRoutingModule } from './editevent-routing.module';

import { EditeventPage } from './editevent.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    EditeventPageRoutingModule
  ],
  declarations: [EditeventPage]
})
export class EditeventPageModule {}
