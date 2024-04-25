import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
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

  ngOnInit() {
    if (this.authService.getLoggedUser() == null) {
      this.routingService.goToLoginPage();
      this.alertService.presentAlert('Você tentou acessar uma página sem estar logado', 'Para acessar essa página você precisa estar logado, realize o login e tente novamente');
    }

    const routeSubscription = this.route.params.subscribe(params => {
      const eventIndex = +params['index'];
      const cameFrom = params['from'];
      if (cameFrom === 'home') {
        const allEventsSubscription = this.firebaseService.getAllEvents().subscribe(res => {
          this.events = res.map(events => { return { id: events.payload.doc.id, ...events.payload.doc.data() as any }});
          console.log("Teste");
          this.selectedEvent = this.events[eventIndex];
          this.eventId = this.selectedEvent.id;
          this.event = new Event(this.selectedEvent.eventTitle, this.selectedEvent.eventDesc, this.selectedEvent.imageURL, this.selectedEvent.maxParticipants);

          const eventOwnerInfoSubscription = this.firebaseService.getEventOwnerInfo(this.selectedEvent.ownerUid).subscribe(res => {
            this.eventOwner = res.map(eventOwner => { return { id: eventOwner.payload.doc.id, ...eventOwner.payload.doc.data() as any } as any });
            this.owner = this.eventOwner[0];
            this.event!.ownerName = this.owner.userName;
            this.event!.ownerImage = this.owner.imageURL;
            this.isUserEventOwner = this.firebaseService.isUserEventOwner(this.loggedUserUID, this.owner.uid);
          });
          this.subscriptions.push(eventOwnerInfoSubscription);
        });
        this.subscriptions.push(allEventsSubscription);
      } else {
        const userEventsSubscription = this.firebaseService.getUserEvents().subscribe(res => {
          this.events = res.map(events => { return { id: events.payload.doc.id, ...events.payload.doc.data() as any }});
          console.log("Teste");
          this.selectedEvent = this.events[eventIndex];
          this.eventId = this.selectedEvent.id;
          this.event = new Event(this.selectedEvent.eventTitle, this.selectedEvent.eventDesc, this.selectedEvent.imageURL, this.selectedEvent.maxParticipants);

          const eventOwnerInfoSubscription = this.firebaseService.getEventOwnerInfo(this.selectedEvent.ownerUid).subscribe(res => {
            this.eventOwner = res.map(eventOwner => { return { id: eventOwner.payload.doc.id, ...eventOwner.payload.doc.data() as any } as any });
            this.owner = this.eventOwner[0];
            this.event!.ownerName = this.owner.userName;
            this.event!.ownerImage = this.owner.imageURL;
            this.isUserEventOwner = this.firebaseService.isUserEventOwner(this.loggedUserUID, this.owner.uid);
          });
          this.subscriptions.push(eventOwnerInfoSubscription);
        });
        this.subscriptions.push(userEventsSubscription);
      }
    })
    this.subscriptions.push(routeSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      if (subscription) {
        subscription.unsubscribe();
      }
    })
  }

  showConfirmDeleteEvent() {
    this.alertService.presentConfirmAlert('Atenção', 'Tem certeza que deseja deletar esse evento? Essa ação não pode ser desfeita', this.deleteEvent.bind(this));
  }

  async deleteEvent() {
    if (!this.isUserEventOwner) {
      this.alertService.presentAlert('Erro', 'Você não pode deletar um evento que não é seu');
    } else {
      await this.firebaseService.deleteEventAndEventImage(this.eventId);
      this.routingService.goBackToPreviousPage();
    }
  }

  addEventParticipation() {
    this.firebaseService.addEventParticipation(this.eventId);
  }

  goToEditEvent() {
    this.routingService.goToEditEventPage(this.eventId);
  }
}
