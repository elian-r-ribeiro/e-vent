import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Subscription } from 'rxjs';
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
  events: any;
  userData: any;
  userInfo: any;
  userName!: string;
  imageURL!: string;
  darkMode = false;

  constructor(private othersService: OthersService, private firebaseService: FirebaseService, private routingService: RoutingService, private authService: AuthService, private alertService: AlertService, private auth: AngularFireAuth) {

  }

  private subscriptions: Subscription[] = [];

  ngOnInit() {
    this.darkMode = this.othersService.checkAppMode();
    this.user = this.authService.getLoggedUserThroughLocalStorage();
    if (this.user == null) {
      this.routingService.goToLoginPage();
      this.alertService.presentAlert('Você tentou acessar uma página sem estar logado', 'Para acessar essa página você precisa estar logado, realize o login e tente novamente');
    }
    const userInfoSubscription = this.authService.getUserInfoFromFirebase().subscribe(res => {
      this.userInfo = res.map(userInfo => { return { id: userInfo.payload.doc.id, ...userInfo.payload.doc.data() as any } as any });
    });
    this.subscriptions.push(userInfoSubscription);
    const eventsSubscription = this.firebaseService.getAllEvents().subscribe(res =>
      this.events = res.map(events => { return { id: events.payload.doc.id, ...events.payload.doc.data() as any } as any }));
    this.subscriptions.push(eventsSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      if (subscription) {
        subscription.unsubscribe();
      }
    })
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
