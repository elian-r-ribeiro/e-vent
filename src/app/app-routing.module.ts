import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./view/events/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'register',
    loadChildren: () => import('./view/user/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./view/user/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: ':from/event/:index',
    loadChildren: () => import('./view/events/event/event.module').then( m => m.EventPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./view/user/profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'new-event',
    loadChildren: () => import('./view/events/new-event/new-event.module').then( m => m.NewEventPageModule)
  },
  {
    path: 'my-events',
    loadChildren: () => import('./view/events/my-events/my-events.module').then( m => m.MyEventsPageModule)
  },
  {
    path: 'passwordreset',
    loadChildren: () => import('./view/user/passwordreset/passwordreset.module').then( m => m.PasswordresetPageModule)
  },
  {
    path: 'editevent/:eventid',
    loadChildren: () => import('./view/events/editevent/editevent.module').then( m => m.EditeventPageModule)
  },
  {
    path: ':from/event/:index/event-config',
    loadChildren: () => import('./view/events/event-config/event-config.module').then( m => m.EventConfigPageModule)
  },
  {
    path: ':from/event/:index/event-config/participant/:participantIndex',
    loadChildren: () => import('./view/events/participant-info/participant-info.module').then( m => m.ParticipantInfoPageModule)
  },





];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
