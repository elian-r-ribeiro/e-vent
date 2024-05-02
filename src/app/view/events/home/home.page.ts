import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/common/alert.service';
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

  constructor(private firebaseService: FirebaseService, private routingService: RoutingService, private authService: AuthService, private alertService: AlertService, private auth: AngularFireAuth) {

  }

  private subscriptions: Subscription[] = [];

  ngOnInit() {
    this.checkAppMode();
    this.user = this.authService.getLoggedUser();
    if (this.user == null) {
      this.routingService.goToLoginPage();
      this.alertService.presentAlert('Você tentou acessar uma página sem estar logado', 'Para acessar essa página você precisa estar logado, realize o login e tente novamente');
    }
    const userInfoSubscription = this.authService.getUserInfo().subscribe(res => {
      this.userInfo = res.map(userInfo => { return { id: userInfo.payload.doc.id, ...userInfo.payload.doc.data() as any } as any })
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

  checkAppMode(){
    const isAppInDarkMode = localStorage.getItem('darkModeActivated');
    isAppInDarkMode == 'true'?(this.darkMode = true):(this.darkMode = false);
    document.body.classList.toggle('dark', this.darkMode);
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
    this.darkMode = !this.darkMode;

    document.body.classList.toggle('dark', this.darkMode);

    if(this.darkMode){
      localStorage.setItem('darkModeActivated', 'true');
    } else {
      localStorage.setItem('darkModeActivated', 'false');
    }
  }

  logout() {
    this.authService.logout();
  }
}
