import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class RoutingService {

  constructor(private router : Router, private location: Location) { }

  goToLoginPage(){
    this.router.navigate(['/login']);
  }

  goToRegisterPage(){
    this.router.navigate(['/register']);
  }

  goToNewEventPage(){
    this.router.navigate(['/new-event']);
  }

  goToEventPage(index: number, from: string){
    this.router.navigate([from, 'event', index]);
  }

  goToEditEventPage(eventid?: string){
    this.router.navigate(['/editevent', eventid]);
  }

  goToProfilePage(){
    this.router.navigate(['/profile']);
  }

  goToMyEventsPage(){
    this.router.navigate(['/my-events']);
  }

  goToHomePage(){
    this.router.navigate(['/home']);
  }

  goToResetPasswordPage(){
    this.router.navigate(['/passwordreset']);
  }

  goBackToPreviousPage(){
    this.location.back();
  }

  goToEventConfigPage(from: string, index: number){
    this.router.navigate([from, 'event', index, 'event-config']);
  }

  goToParticipantInfoPage(from: string, index: number, participantIndex: number){
    this.router.navigate([from, 'event', index, 'event-config', 'participant', participantIndex]);
  }
}
