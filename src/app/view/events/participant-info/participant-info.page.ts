import { Component, OnDestroy, OnInit } from '@angular/core';
import { DocumentChangeAction } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { OthersService } from 'src/app/common/others.service';
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


  constructor(private route: ActivatedRoute, private firebaseService: FirebaseService, private othersService: OthersService) { }

  ngOnInit() {
    this.othersService.checkAppMode();
    const routeSubscription = this.route.params.subscribe(res => {
      this.eventIndex = +res['index'];
      this.cameFrom = res['from'];
      this.participantIndex = res['participantIndex'];

      if (this.cameFrom == 'home') {
        this.processParticipants(this.firebaseService.getAllEvents());
      } else {
        this.processParticipants(this.firebaseService.getUserEvents());
      }
    });
    this.subscriptions.push(routeSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  async processParticipants(getEventFn: Observable<DocumentChangeAction<unknown>[]>) {
    const eventSubscription = getEventFn.subscribe((res: any[]) => {
      const eventResponse = res.map(event => { return { id: event.payload.doc.id, ...event.payload.doc.data() as any } as any });
      const eventInfo = eventResponse[this.eventIndex];
      this.eventId = eventInfo.id;
      const participantsSubscription = this.firebaseService.getEventParticipants(this.eventId).subscribe(res => {
        const participant = res.map(participant => { return { id: participant.payload.doc.id, ...participant.payload.doc.data() as any } as any });
        this.participant = participant[this.participantIndex];
        if(this.participant.didParticipantWentToEvent == true){
          this.didParticipantWentToEvent = "Sim";
        } else {
          this.didParticipantWentToEvent = "Não";
        }
      });
      this.subscriptions.push(participantsSubscription);
    })
    this.subscriptions.push(eventSubscription);
  }

}
