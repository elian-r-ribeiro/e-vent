import { Component, OnDestroy, OnInit } from '@angular/core';
import { DocumentChangeAction } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AlertService } from 'src/app/common/alert.service';
import { AuthService } from 'src/app/model/services/auth.service';
import { FirebaseService } from 'src/app/model/services/firebase.service';
import { RoutingService } from 'src/app/model/services/routing.service';

@Component({
  selector: 'app-event-config',
  templateUrl: './event-config.page.html',
  styleUrls: ['./event-config.page.scss'],
})
export class EventConfigPage implements OnInit, OnDestroy {

  cameFrom!: string;
  eventIndex!: number;
  subscriptions: Subscription[] = [];
  eventId!: string;
  participants: any;
  logedUser = this.authService.getLoggedUser();
  ownerId!: string;
  currentParticipantsNumber?: number
  eventInfo: any;

  constructor(private route: ActivatedRoute, private firebaseService: FirebaseService, private authService: AuthService, private alertService: AlertService, private routingService: RoutingService) { }

  ngOnInit() {
    const routeSubscription = this.route.params.subscribe(res => {
      this.eventIndex = +res['index'];
      this.cameFrom = res['from'];

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
      this.eventInfo = eventResponse[this.eventIndex];
      this.eventId = this.eventInfo.id;
      this.ownerId = this.eventInfo.ownerUid;
      
      if(this.ownerId != this.logedUser.uid){
        this.alertService.presentAlert("Erro", "Esse evento não é seu");
        this.routingService.goToHomePage();
      } else {
        const participantsSubscription = this.firebaseService.getEventParticipants(this.eventId).subscribe(res => {
          this.currentParticipantsNumber = res.length;
          const participants = res.map(participant => { return { id: participant.payload.doc.id, ...participant.payload.doc.data() as any } as any });
          this.participants = participants;
        })
        this.subscriptions.push(participantsSubscription);
      }
    })
    this.subscriptions.push(eventSubscription);
  }

  goToParticipantInfoPage(participantIndex: number){
    this.routingService.goToParticipantInfoPage(this.cameFrom, this.eventIndex, participantIndex);
  }

  async showConfirmRemoveParticipant(index: number){
    const participationId = this.participants[index].id;
    await this.alertService.presentConfirmAlert("Atenção", "Tem certeza que deseja remover esse participante desse evento?", async () => {
      await this.firebaseService.removeEventParticipation(participationId)
      this.alertService.presentAlert("Sucesso", "Participante removido com sucesso");
    });
  }
}
