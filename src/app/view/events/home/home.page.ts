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

  async ngOnInit(): Promise<void> {
    this.darkMode = this.othersService.checkAppMode();
    this.user = this.authService.getLoggedUserThroughLocalStorage();
    this.authService.checkIfUserIsntLogged();
    this.setUserProfileInfo();
    this.setEventsList();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      if (subscription) {
        subscription.unsubscribe();
      }
    })
  }

  setEventsList(): void {
    this.events$ = this.firebaseService.getSomethingFromFirebaseAlreadySubscribed('events');
  }

  setUserProfileInfo(): void {
    const userInfoSubscription = this.firebaseService.getSomethingFromFirebaseWithConditionAlreadySubscribed('uid', this.loggedUserUid, 'users').subscribe(res => {
      this.userInfo = res;
    });
    this.subscriptions.push(userInfoSubscription);
  }

  goToNewEventPage(): void {
    this.routingService.goToNewEventPage();
  }

  goToEventPage(index: number): void {
    this.routingService.goToEventPage(index, 'home');
  }

  goToProfilePage(): void {
    this.routingService.goToProfilePage();
  }

  goToMyEventsPage(): void {
    this.routingService.goToMyEventsPage();
  }

  toggleDarkMode(): void {
    this.othersService.toggleDarkMode(this.darkMode);
    this.darkMode = this.othersService.checkAppMode();
  }

  logout(): void {
    this.authService.logout();
  }
}
