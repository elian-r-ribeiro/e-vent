import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { OthersService } from 'src/app/common/others.service';
import { AuthService } from 'src/app/model/services/auth.service';
import { FirebaseService } from 'src/app/model/services/firebase.service';
import { RoutingService } from 'src/app/model/services/routing.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  user: any;
  events$?: Observable<any[]>;
  userInfo: any;
  darkMode = false;
  loggedUserUid = this.authService.getLoggedUserThroughLocalStorage().uid;

  constructor(private othersService: OthersService, private firebaseService: FirebaseService, private routingService: RoutingService, private authService: AuthService) {

  }

  private subscriptions: Subscription[] = [];

  async ngOnInit() {
    this.darkMode = this.othersService.checkAppMode();
    this.user = this.authService.getLoggedUserThroughLocalStorage();
    this.authService.checkIfUserIsntLogged();
    this.setUserProfileInfo();
    this.setEventsList();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      if (subscription) {
        subscription.unsubscribe();
      }
    })
  }

  setEventsList(){
    this.events$ = this.firebaseService.getSomethingFromFirebaseAlreadySubscribed('events');
  }

  setUserProfileInfo(){
    const userInfoSubscription = this.firebaseService.getSomethingFromFirebaseWithConditionAlreadySubscribed('uid', this.loggedUserUid, 'users').subscribe(res => {
      this.userInfo = res;
    });
    this.subscriptions.push(userInfoSubscription);
  }

  goToNewEventPage() {
    this.routingService.goToNewEventPage();
  }

  goToEventPage(index: number) {
    this.routingService.goToEventPage(index, 'home');
  }

  goToProfilePage() {
    this.routingService.goToProfilePage();
  }

  goToMyEventsPage() {
    this.routingService.goToMyEventsPage();
  }

  toggleDarkMode(){
    this.othersService.toggleDarkMode(this.darkMode);
    this.darkMode = this.othersService.checkAppMode();
  }

  logout() {
    this.authService.logout();
  }
}
