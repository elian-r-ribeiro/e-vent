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
  userEvents: any;
  darkMode = false;

  constructor(private router: Router, private othersService: OthersService, private firebaseService: FirebaseService, private authService: AuthService, private routingService: RoutingService, private alertService: AlertService) { }

  ngOnInit() {
    this.darkMode = this.othersService.checkAppMode();
    this.authService.checkIfUserIsntLoged();
    const getUserInfoSubscription = this.authService.getUserInfoFromFirebase().subscribe(res=>{
      this.userInfo = res.map(userInfo => 
        {return{id:userInfo.payload.doc.id, ...userInfo.payload.doc.data() as any} as any})
    })
    this.subscriptions.push(getUserInfoSubscription);
    const getUserEventsSubscription = this.firebaseService.getUserEvents().subscribe(res=>{
      this.userEvents = res.map(userEvents => 
        {return{id:userEvents.payload.doc.id, ...userEvents.payload.doc.data() as any} as any})
    })
    this.subscriptions.push(getUserEventsSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      if(subscription){
        subscription.unsubscribe();
      }
    })
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
