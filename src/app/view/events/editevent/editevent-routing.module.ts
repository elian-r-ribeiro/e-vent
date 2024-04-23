import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditeventPage } from './editevent.page';

const routes: Routes = [
  {
    path: '',
    component: EditeventPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditeventPageRoutingModule {}
