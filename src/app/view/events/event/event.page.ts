import { Component, OnDestroy, OnInit } from '@angular/core';
import { DocumentChangeAction } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AlertService } from 'src/app/common/alert.service';
import { Event } from 'src/app/model/entities/event';
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

  constructor(private authService: AuthService, private routingService: RoutingService, private alertService: AlertService, private firebaseService: FirebaseService, private route: ActivatedRoute) { }

  event?: Event;
  isUserEventOwner?: boolean = false;
  events: any;
  selectedEvent: any;
  eventOwner: any;
  owner: any;
  loggedUserUID: string = this.authService.getLoggedUser().uid;
  eventId!: string;
  participantsInfo: any;
  loggedUserInfoReadyToUse: any;
  eventParticipants: any;
  isUserAlreadyEventParticipant?: boolean;
  userParticipationOnEventId: string = "";
  currentParticipantsNumber?: number;
  eventIndex!: number;
  cameFrom!: string;

  ngOnInit() {
    if (this.authService.getLoggedUser() == null) {
      this.routingService.goToLoginPage();
      this.alertService.presentAlert('Você tentou acessar uma página sem estar logado', 'Para acessar essa página você precisa estar logado, realize o login e tente novamente');
    }

    const routeSubscription = this.route.params.subscribe(params => {
      this.eventIndex = +params['index'];
      this.cameFrom = params['from'];
      if (this.cameFrom === 'home') {
        this.processEvents(this.firebaseService.getAllEvents(), this.eventIndex);
      } else {
        this.processEvents(this.firebaseService.getUserEvents(), this.eventIndex);
      }
    })
    this.subscriptions.push(routeSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    })
  }

  async processEvents(getEventsFn: Observable<DocumentChangeAction<unknown>[]>, eventIndex: number) {
    const eventsSubscription = getEventsFn.subscribe((res: any[]) => {
        this.events = res.map(events => { return { id: events.payload.doc.id, ...events.payload.doc.data() as any } });
        this.selectedEvent = this.events[eventIndex];
        this.eventId = this.selectedEvent.id;

        const eventOwnerInfoSubscription = this.firebaseService.getEventOwnerInfo(this.selectedEvent.ownerUid).subscribe(res => {
            this.eventOwner = res.map(eventOwner => { return { id: eventOwner.payload.doc.id, ...eventOwner.payload.doc.data() as any } as any });
            this.owner = this.eventOwner[0];
            this.isUserEventOwner = this.firebaseService.isUserEventOwner(this.loggedUserUID, this.owner.uid);

            const loggedUserInfoSubscription = this.authService.getUserInfo().subscribe(res => {
                const loggedUserInfoResponse = res.map(userInfo => { return { id: userInfo.payload.doc.id, ...userInfo.payload.doc.data() as any } as any });
                this.loggedUserInfoReadyToUse = loggedUserInfoResponse[0];

                const eventParticipantsSubscription = this.firebaseService.getEventParticipants(this.eventId).subscribe(res => {
                    this.currentParticipantsNumber = res.length;
                    this.eventParticipants = res.map(eventParticipants => { return { id: eventParticipants.payload.doc.id, ...eventParticipants.payload.doc.data() as any } as any });

                    const getUserAlreadyParticipatingOnEventSubscription = this.firebaseService.getUserAlreadyParticipatingOnEvent(this.eventId, this.loggedUserUID).subscribe(res => {
                        if(res.length > 0){
                            this.isUserAlreadyEventParticipant = true;
                            const getUserAlreadyParticipatingOnEventResponse = res.map(participationInfo => { return { id: participationInfo.payload.doc.id, ...participationInfo.payload.doc.data() as any } as any });
                            this.userParticipationOnEventId = getUserAlreadyParticipatingOnEventResponse[0].id;
                        } else {
                            this.isUserAlreadyEventParticipant = false;
                        }
                    });
                    this.subscriptions.push(getUserAlreadyParticipatingOnEventSubscription);
                });
                this.subscriptions.push(eventParticipantsSubscription);
            });
            this.subscriptions.push(loggedUserInfoSubscription);
        });
        this.subscriptions.push(eventOwnerInfoSubscription);
    });
    this.subscriptions.push(eventsSubscription);
}


  showConfirmDeleteEvent() {
    this.alertService.presentConfirmAlert('Atenção', 'Tem certeza que deseja deletar esse evento? Essa ação não pode ser desfeita', this.deleteEvent.bind(this));
  }

  async deleteEvent() {
    if (!this.isUserEventOwner) {
      this.alertService.presentAlert('Erro', 'Você não pode deletar um evento que não é seu');
    } else {
      await this.firebaseService.deleteEventAndEventImageAndEventParticipations(this.eventId);
      this.routingService.goBackToPreviousPage();
    }
  }

  openEventConfig(){
    this.routingService.goToEventConfigPage(this.cameFrom, this.eventIndex);
  }

  showConfirmEventParticipation() {
    this.alertService.presentConfirmAlert("Atenção", "Tem certeza que deseja confirmar participação nesse evento?", this.addEventParticipation.bind(this));
  }

  showConfirmEventCancelParticipation(){
    this.alertService.presentConfirmAlert("Atenção", "Tem certeza que deseja cancelar a particição nesse evento?", this.removeEventParticipation.bind(this));
  }

  async addEventParticipation() {
    if(this.isUserAlreadyEventParticipant){
      this.alertService.presentAlert("Erro", "Você já está inscrito nesse evento");
    } else if(this.currentParticipantsNumber == this.selectedEvent.maxParticipants) {
      this.alertService.presentAlert("Erro", "Número máximo de participantes do evento atingido");
    } else {
      await this.firebaseService.addEventParticipation(this.eventId, this.loggedUserInfoReadyToUse.uid, this.loggedUserInfoReadyToUse.userName, this.loggedUserInfoReadyToUse.phoneNumber, this.loggedUserInfoReadyToUse.email, this.loggedUserInfoReadyToUse.imageURL);
      this.alertService.presentAlert("Sucesso", "Participação no evento confirmada com sucesso");
    }
  }

  async removeEventParticipation(){
    if(!this.isUserAlreadyEventParticipant){
      this.alertService.presentAlert("Erro", "Você não está inscrito nesse evento");
    } else {
      await this.firebaseService.removeEventParticipation(this.userParticipationOnEventId);
      this.alertService.presentAlert("Sucesso", "Inscrição no evento cancelada com sucesso");
    }
  }

  goToEditEvent() {
    this.routingService.goToEditEventPage(this.eventId);
  }
}
