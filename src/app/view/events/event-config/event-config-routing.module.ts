import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventConfigPage } from './event-config.page';

const routes: Routes = [
  {
    path: '',
    component: EventConfigPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventConfigPageRoutingModule {}
