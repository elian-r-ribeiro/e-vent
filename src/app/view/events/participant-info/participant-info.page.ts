import { Component, OnDestroy, OnInit } from '@angular/core';
import { DocumentChangeAction } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { OthersService } from 'src/app/common/others.service';
import { AuthService } from 'src/app/model/services/auth.service';
import { FirebaseService } from 'src/app/model/services/firebase.service';

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


  constructor(private authService: AuthService, private route: ActivatedRoute, private firebaseService: FirebaseService, private othersService: OthersService) { }

  ngOnInit() {
    this.authService.checkIfUserIsntLoged();
    this.othersService.checkAppMode();
    this.getRouteInfo();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  getRouteInfo(){
    const routeSubscription = this.route.params.subscribe(res => {
      this.eventIndex = +res['index'];
      this.cameFrom = res['from'];
      this.participantIndex = res['participantIndex'];

      if (this.cameFrom == 'home') {
        this.setEventInfo(this.firebaseService.getAllEventsAlreadySubscribed());
      } else {
        this.setEventInfo(this.firebaseService.getUserEventsAlreadySubscribed());
      }
    });
    this.subscriptions.push(routeSubscription);
  }

  setEventInfo(getEventFn: Observable<DocumentChangeAction<unknown>[]>){
    const eventSubscription = getEventFn.subscribe((res: any[]) => {
      const eventResponse = res;
      const eventInfo = eventResponse[this.eventIndex];
      this.eventId = eventInfo.id;
      this.getEventParticipantAndSetParticipantWentToEventOrNot();
    });
    this.subscriptions.push(eventSubscription);
  }

  async getEventParticipantAndSetParticipantWentToEventOrNot() {
      const participantsSubscription = this.firebaseService.getEventParticipantsAlreadySubscribed(this.eventId).subscribe(res => {
        const participant = res;
        this.participant = participant[this.participantIndex];
        if(this.participant.didParticipantWentToEvent == true){
          this.didParticipantWentToEvent = "Sim";
        } else {
          this.didParticipantWentToEvent = "Não";
        }
      });
      this.subscriptions.push(participantsSubscription);
  }
}
