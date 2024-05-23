import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class RoutingService {

  constructor(private router: Router, private location: Location) { }

  goToLoginPage(): void {
    this.router.navigate(['/login']);
  }

  goToRegisterPage(): void {
    this.router.navigate(['/register']);
  }

  goToNewEventPage(): void {
    this.router.navigate(['/new-event']);
  }

  goToEventPage(index: number, from: string): void {
    this.router.navigate([from, 'event', index]);
  }

  goToEditEventPage(eventid?: string): void {
    this.router.navigate(['/editevent', eventid]);
  }

  goToProfilePage(): void {
    this.router.navigate(['/profile']);
  }

  goToMyEventsPage(): void {
    this.router.navigate(['/my-events']);
  }

  goToHomePage(): void {
    this.router.navigate(['/home']);
  }

  goToResetPasswordPage(): void {
    this.router.navigate(['/passwordreset']);
  }

  goBackToPreviousPage(): void {
    this.location.back();
  }

  goToEventConfigPage(from: string, index: number): void {
    this.router.navigate([from, 'event', index, 'event-config']);
  }

  goToParticipantInfoPage(from: string, index: number, participantIndex: number): void {
    this.router.navigate([from, 'event', index, 'event-config', 'participant', participantIndex]);
  }
}
