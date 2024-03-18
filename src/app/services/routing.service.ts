import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoutingService {

  constructor(private router : Router) { }

  goToLoginPage(){
    this.router.navigate(['/login'])
  }

  goToRegisterPage(){
    this.router.navigate(['/register'])
  }

  goToNewEventPage(){
    this.router.navigate(['/new-event'])
  }

  goToEventPage(){
    this.router.navigate(['/event'])
  }

  goToProfilePage(){
    this.router.navigate(['/profile'])
  }
}
