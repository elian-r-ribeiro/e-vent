import { Component, OnDestroy, OnInit } from '@angular/core';
import { DocumentChangeAction } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AlertService } from 'src/app/common/alert.service';
import { OthersService } from 'src/app/common/others.service';
import { AuthService } from 'src/app/model/services/auth.service';
import { FirebaseService } from 'src/app/model/services/firebase.service';
import { RoutingService } from 'src/app/model/services/routing.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.page.html',
  styleUrls: ['./event.page.scss'],
})
export class EventPage implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];

  constructor(private othersService: OthersService, private authService: AuthService, private routingService: RoutingService, private alertService: AlertService, private firebaseService: FirebaseService, private route: ActivatedRoute) { }

  isUserEventOwner?: boolean = false;
  events: any;
  selectedEvent: any;
  eventOwner: any;
  owner: any;
  loggedUserUID: string = this.authService.getLoggedUserThroughLocalStorage().uid;
  eventId!: string;
  loggedUserInfoReadyToUse: any;
  eventParticipants: any;
  isUserAlreadyEventParticipant?: boolean;
  userParticipationOnEventId: string = "";
  currentParticipantsNumber?: number;
  eventIndex!: number;
  cameFrom!: string;
  shouldShowOwnerButtons: boolean = false;

  ngOnInit(): void {
    this.othersService.checkAppMode();
    this.authService.checkIfUserIsntLogged();
    this.getRouteInfo();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    })
  }

  getRouteInfo(): void {
    const routeSubscription = this.route.params.subscribe(params => {
      this.eventIndex = +params['index'];
      this.cameFrom = params['from'];
      if (this.cameFrom === 'home') {
        this.setEventInfo(this.firebaseService.getSomethingFromFirebaseAlreadySubscribed('events'), this.eventIndex);
        this.getLoggedUserInfo();
      } else {
        this.setEventInfo(this.firebaseService.getSomethingFromFirebaseWithConditionAlreadySubscribed('ownerUid', this.loggedUserUID, 'events'), this.eventIndex);
        this.getLoggedUserInfo();
      }
    })
    this.subscriptions.push(routeSubscription);
  }

  getLoggedUserInfo(): void {
    const loggedUserInfoSubscription = this.firebaseService.getSomethingFromFirebaseWithConditionAlreadySubscribed('uid', this.loggedUserUID, 'users').subscribe(res => {
      this.loggedUserInfoReadyToUse = res[0];
    });
    this.subscriptions.push(loggedUserInfoSubscription);
  }

  setEventInfo(getEventsFn: Observable<DocumentChangeAction<unknown>[]>, eventIndex: number): void {
    const eventsSubscription = getEventsFn.subscribe((res: any[]) => {
      this.events = res;
      this.selectedEvent = this.events[eventIndex];
      this.eventId = this.selectedEvent.id;
      this.setEventOwnerInfo();
      this.getEventParticipants();
      this.getUserEventParticipation();
    });
    this.subscriptions.push(eventsSubscription);
  }

  setEventOwnerInfo(): void {
    const eventOwnerInfoSubscription = this.firebaseService.getSomethingFromFirebaseWithConditionAlreadySubscribed('uid', this.selectedEvent.ownerUid, 'users').subscribe(async res => {
      this.eventOwner = res;
      this.owner = this.eventOwner[0];
      this.isUserEventOwner = await this.firebaseService.isUserEventOwnerOrAdmin(this.owner.uid);
    });
    this.subscriptions.push(eventOwnerInfoSubscription);
  }

  getEventParticipants(): void {
    const eventParticipantsSubscription = this.firebaseService.getSomethingFromFirebaseWithConditionAlreadySubscribed('eventId', this.eventId, 'participations').subscribe(res => {
      this.currentParticipantsNumber = res.length;
      this.eventParticipants = res;
    });
    this.subscriptions.push(eventParticipantsSubscription);
  }

  async getUserEventParticipation(): Promise<void> {          
    const getUserAlreadyParticipatingOnEventSubscription = this.firebaseService.getUserAlreadyParticipatingOnEventAlreadySubscribed(this.eventId, this.loggedUserUID).subscribe(res => {
        if(res.length > 0){
            this.isUserAlreadyEventParticipant = true;
            const getUserAlreadyParticipatingOnEventResponse = res;
            this.userParticipationOnEventId = getUserAlreadyParticipatingOnEventResponse[0].id;
        } else {
            this.isUserAlreadyEventParticipant = false;
        }
    });
    this.subscriptions.push(getUserAlreadyParticipatingOnEventSubscription);
}


  showConfirmDeleteEvent(): void {
    this.alertService.presentConfirmAlert('Atenção', 'Tem certeza que deseja deletar esse evento? Essa ação não pode ser desfeita', this.deleteEvent.bind(this));
  }

  async deleteEvent(): Promise<void> {
    await this.firebaseService.deleteEventAndEventImageAndEventParticipations(this.eventId);
    this.routingService.goBackToPreviousPage();
  }

  toggleOwnerButtons(): void {
    if(this.shouldShowOwnerButtons == false){
      this.shouldShowOwnerButtons = true;
    } else {
      this.shouldShowOwnerButtons = false;
    }
  }

  openEventConfig(): void {
    this.routingService.goToEventConfigPage(this.cameFrom, this.eventIndex);
  }

  showConfirmEventParticipation(): void {
    this.alertService.presentConfirmAlert("Atenção", "Tem certeza que deseja confirmar participação nesse evento?", this.addEventParticipation.bind(this));
  }

  showConfirmEventCancelParticipation(): void {
    this.alertService.presentConfirmAlert("Atenção", "Tem certeza que deseja cancelar a particição nesse evento?", this.removeEventParticipation.bind(this));
  }

  async addEventParticipation(): Promise<void> {
    if(this.isUserAlreadyEventParticipant){
      this.alertService.presentAlert("Erro", "Você já está inscrito nesse evento");
    } else if(this.currentParticipantsNumber == this.selectedEvent.maxParticipants) {
      this.alertService.presentAlert("Erro", "Número máximo de participantes do evento atingido");
    } else {
      await this.firebaseService.addEventParticipation(this.eventId, this.loggedUserInfoReadyToUse.uid, this.loggedUserInfoReadyToUse.userName, this.loggedUserInfoReadyToUse.phoneNumber, this.loggedUserInfoReadyToUse.email, this.loggedUserInfoReadyToUse.imageURL);
      this.alertService.presentAlert("Sucesso", "Participação no evento confirmada com sucesso");
    }
  }

  async removeEventParticipation(): Promise<void> {
    if(!this.isUserAlreadyEventParticipant){
      this.alertService.presentAlert("Erro", "Você não está inscrito nesse evento");
    } else {
      await this.firebaseService.removeEventParticipation(this.userParticipationOnEventId);
      this.alertService.presentAlert("Sucesso", "Inscrição no evento cancelada com sucesso");
    }
  }

  goToEditEvent(): void {
    this.routingService.goToEditEventPage(this.eventId);
  }
}
