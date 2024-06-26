import { Component, OnDestroy, OnInit } from '@angular/core';
import { DocumentChangeAction } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { OthersService } from 'src/app/common/others.service';
import { AuthService } from 'src/app/model/services/auth.service';
import { FirebaseService } from 'src/app/model/services/firebase.service';
import { RoutingService } from 'src/app/model/services/routing.service';

@Component({
  selector: 'app-participant-info',
  templateUrl: './participant-info.page.html',
  styleUrls: ['./participant-info.page.scss'],
})
export class ParticipantInfoPage implements OnInit, OnDestroy {

  eventIndex!: number;
  cameFrom!: string;
  subscriptions: Subscription[] = [];
  eventId!: string;
  participantIndex!: number;
  participant: any;
  didParticipantWentToEvent!: string;
  loggedUserUid = this.authService.getLoggedUserThroughLocalStorage().uid;


  constructor(private authService: AuthService, private route: ActivatedRoute, private firebaseService: FirebaseService, private othersService: OthersService, private routingService: RoutingService) { }

  ngOnInit(): void {
    this.authService.checkIfUserIsntLogged();
    this.othersService.checkAppMode();
    this.getRouteInfo();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  getRouteInfo(): void {
    const routeSubscription = this.route.params.subscribe(res => {
      this.eventIndex = +res['index'];
      this.cameFrom = res['from'];
      this.participantIndex = res['participantIndex'];

      if (this.cameFrom == 'home') {
        this.setEventInfo(this.firebaseService.getSomethingFromFirebaseAlreadySubscribed('events'));
      } else {
        this.setEventInfo(this.firebaseService.getSomethingFromFirebaseWithConditionAlreadySubscribed('ownerUid', this.loggedUserUid, 'events'));
      }
    });
    this.subscriptions.push(routeSubscription);
  }

  setEventInfo(getEventFn: Observable<DocumentChangeAction<unknown>[]>): void {
    const eventSubscription = getEventFn.subscribe((res: any[]) => {
      const eventResponse = res;
      const eventInfo = eventResponse[this.eventIndex];
      this.eventId = eventInfo.id;
      this.getEventParticipantAndSetParticipantWentToEventOrNot();
    });
    this.subscriptions.push(eventSubscription);
  }

  async getEventParticipantAndSetParticipantWentToEventOrNot(): Promise<void> {
    const participantsSubscription = this.firebaseService.getSomethingFromFirebaseWithConditionAlreadySubscribed('eventId', this.eventId, 'participations').subscribe(res => {
      const participant = res;
      this.participant = participant[this.participantIndex];
      if (this.participant.didParticipantWentToEvent == true) {
        this.didParticipantWentToEvent = "Sim";
      } else {
        this.didParticipantWentToEvent = "Não";
      }
    });
    this.subscriptions.push(participantsSubscription);
  }

  goBackToPreviousPage() {
    this.routingService.goBackToPreviousPage();
  }
}
