import { Component, OnInit } from '@angular/core';
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
export class EventPage implements OnInit {

  constructor(private authService: AuthService, private routingService: RoutingService, private alertService: AlertService, private firebaseService: FirebaseService) { }

  event?: Event;
  events: any;
  selectedEvent: any;
  eventOwner: any;
  owner: any;

  ngOnInit() {
    if (this.authService.getLoggedUser() == null) {
      this.routingService.goToLoginPage();
      this.alertService.presentAlert('Você tentou acessar uma página sem estar logado', 'Para acessar essa página você precisa estar logado, realize o login e tente novamente');
    }
    this.firebaseService.getAllEvents().subscribe(res => {
      this.events = res.map(events => {
        return { id: events.payload.doc.id, ...events.payload.doc.data() as any };
      });
      this.selectedEvent = this.events[0];
      this.event = new Event(this.selectedEvent.eventTitle, this.selectedEvent.eventDesc, this.selectedEvent.imageURL, this.selectedEvent.maxParticipants);

      this.firebaseService.getEventOwnerInfo(this.selectedEvent.ownerUid).subscribe(res => {
        this.eventOwner = res.map(eventOwner => { return { id: eventOwner.payload.doc.id, ...eventOwner.payload.doc.data() as any } as any });
        this.owner = this.eventOwner[0];
        this.event!.ownerName = this.owner.userName;
        this.event!.ownerImage = this.owner.imageURL;
      });
    });

  }
}
