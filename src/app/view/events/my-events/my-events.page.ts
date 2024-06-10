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
  loggedUserUid = this.authService.getLoggedUserThroughLocalStorage().uid;

  constructor(private othersService: OthersService, private firebaseService: FirebaseService, private authService: AuthService, private routingService: RoutingService, private alertService: AlertService) { }

  ngOnInit(): void {
    this.darkMode = this.othersService.checkAppMode();
    this.authService.checkIfUserIsntLogged();
    this.setUserProfileInfo();
    this.setEventsList();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      if(subscription){
        subscription.unsubscribe();
      }
    })
  }

  setEventsList(): void{
    const userEventsSubscription = this.firebaseService.getSomethingFromFirebaseWithConditionAlreadySubscribed('ownerUid', this.loggedUserUid, 'events').subscribe(res => { 
      this.userEvents = res;
    });
    this.subscriptions.push(userEventsSubscription);
  }

  setUserProfileInfo(): void {
    const getUserInfoSubscription = this.firebaseService.getSomethingFromFirebaseWithConditionAlreadySubscribed('uid', this.loggedUserUid, 'users').subscribe(res=>{
      this.userInfo = res;
    });
    this.subscriptions.push(getUserInfoSubscription);
  }

  goToNewEventPage(): void {
    this.routingService.goToNewEventPage();
  }

  goToEventPage(index: number): void {
    this.routingService.goToEventPage(index, 'my-events');
  }

  goToProfilePage(): void {
    this.routingService.goToProfilePage();
  }

  goToHomePage(): void {
    this.routingService.goToHomePage();
  }

  toggleDarkMode(): void {
    this.othersService.toggleDarkMode(this.darkMode);
    this.darkMode = this.othersService.checkAppMode();
  }

  showConfirmDeleteEvent(index: number, event: Event) {
    event.stopPropagation();
    this.alertService.presentConfirmAlert('Atenção', 'Tem certeza que deseja deletar esse evento? Essa ação não pode ser desfeita', async () => {
      await this.firebaseService.deleteEventAndEventImageAndEventParticipations(this.userEvents[index].id);
    });
  }

  deleteEvent(index: number) {
    this.firebaseService.deleteEventAndEventImageAndEventParticipations(this.userEvents[index].id);
  }
}
