import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/common/alert.service';
import { OthersService } from 'src/app/common/others.service';
import { AuthService } from 'src/app/model/services/auth.service';
import { FirebaseService } from 'src/app/model/services/firebase.service';
import { RoutingService } from 'src/app/model/services/routing.service';

@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.page.html',
  styleUrls: ['./my-events.page.scss'],
})
export class MyEventsPage implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];

  userInfo: any;
  userEvents$: any;
  darkMode = false;
  loggedUserUid = this.authService.getLoggedUserThroughLocalStorage().uid;

  constructor(private othersService: OthersService, private firebaseService: FirebaseService, private authService: AuthService, private routingService: RoutingService) { }

  ngOnInit() {
    this.darkMode = this.othersService.checkAppMode();
    this.authService.checkIfUserIsntLogged();
    this.setUserProfileInfo();
    this.setEventsList();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      if(subscription){
        subscription.unsubscribe();
      }
    })
  }

  setEventsList(){
    this.userEvents$ = this.firebaseService.getSomethingFromFirebaseWithConditionAlreadySubscribed('ownerUid', this.loggedUserUid, 'events');
  }

  setUserProfileInfo(){
    const getUserInfoSubscription = this.firebaseService.getSomethingFromFirebaseWithConditionAlreadySubscribed('uid', this.loggedUserUid, 'users').subscribe(res=>{
      this.userInfo = res;
    });
    this.subscriptions.push(getUserInfoSubscription);
  }

  goToNewEventPage(){
    this.routingService.goToNewEventPage();
  }

  goToEventPage(index: number){
    this.routingService.goToEventPage(index, 'my-events');
  }

  goToProfilePage(){
    this.routingService.goToProfilePage();
  }

  goToHomePage(){
    this.routingService.goToHomePage();
  }

  toggleDarkMode(){
    this.othersService.toggleDarkMode(this.darkMode);
    this.darkMode = this.othersService.checkAppMode();
  }
}
