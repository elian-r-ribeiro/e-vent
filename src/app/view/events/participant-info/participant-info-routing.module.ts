import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ParticipantInfoPage } from './participant-info.page';

const routes: Routes = [
  {
    path: '',
    component: ParticipantInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParticipantInfoPageRoutingModule {}
