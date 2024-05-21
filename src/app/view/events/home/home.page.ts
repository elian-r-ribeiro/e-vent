import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, Subscription } from 'rxjs';
import { AlertService } from 'src/app/common/alert.service';
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
  userData: any;
  userInfo: any;
  userName!: string;
  imageURL!: string;
  darkMode = false;

  constructor(private othersService: OthersService, private firebaseService: FirebaseService, private routingService: RoutingService, private authService: AuthService, private alertService: AlertService, private auth: AngularFireAuth) {

  }

  private subscriptions: Subscription[] = [];

  async ngOnInit() {
    this.darkMode = this.othersService.checkAppMode();
    this.user = this.authService.getLoggedUserThroughLocalStorage();
    this.authService.checkIfUserIsntLoged();
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
    this.events$ = this.firebaseService.getAllEventsAlreadySubscribed();
  }

  setUserProfileInfo(){
    const userInfoSubscription = this.authService.getUserInfoFromFirebaseAlreadySubscribed().subscribe(res => {
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
