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

  goToEventPage(index: number){
    this.router.navigate(['/event', index])
  }

  goToProfilePage(){
    this.router.navigate(['/profile'])
  }

  goToMyEventsPage(){
    this.router.navigate(['/my-events'])
  }

  goToHomePage(){
    this.router.navigate(['/home'])
  }
}
