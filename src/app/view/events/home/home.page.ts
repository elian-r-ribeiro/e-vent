import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AlertService } from 'src/app/common/alert.service';
import { AuthService } from 'src/app/model/services/auth.service';
import { FirebaseService } from 'src/app/model/services/firebase.service';
import { RoutingService } from 'src/app/model/services/routing.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  public pokemonList = ['Pikachu', 'Charizard', 'Sei lá mais oqueSei lá mais oqueSei lá mais oqueSei lá mais oqueSei lá mais oqueSei lá mais oqueSei lá mais oqueSei lá mais oqueSei lá mais oqueSei lá mais oqueSei lá mais oqueSei lá mais oque', 'Sei lá mais oque', 'Sei lá mais oque', 'Sei lá mais oque',
    'Sei lá mais oque', 'Sei lá mais oque', 'Sei lá mais oque', 'Sei lá mais oque', 'Sei lá mais oque', 'Sei lá mais oque', 'Sei lá mais oque',
    'Sei lá mais oque', 'Sei lá mais oque', 'Sei lá mais oque'];

  user: any;
  events: any;
  userData: any;
  userInfo: any;
  userName!: string;
  imageURL!: string;

  constructor(private firebaseService: FirebaseService, private routingService: RoutingService, private authService: AuthService, private alertService: AlertService, private auth: AngularFireAuth) {

  }

  ngOnInit() {
    this.user = this.authService.getLoggedUser();
    if (this.user == null) {
      this.routingService.goToLoginPage();
      this.alertService.presentAlert('Você tentou acessar uma página sem estar logado', 'Para acessar essa página você precisa estar logado, realize o login e tente novamente');
    }
    this.authService.getUserInfo().subscribe(res => {
      this.userInfo = res.map(userInfo => { return { id: userInfo.payload.doc.id, ...userInfo.payload.doc.data() as any } as any })
    })
    this.firebaseService.getAllEvents().subscribe(res =>
      this.events = res.map(events => { return { id: events.payload.doc.id, ...events.payload.doc.data() as any } as any }
      )
    )
  }

  goToNewEventPage() {
    this.routingService.goToNewEventPage();
  }

  goToEventPage(index: number) {
    this.routingService.goToEventPage(index);
  }

  goToProfilePage() {
    this.routingService.goToProfilePage();
  }

  goToMyEventsPage() {
    this.routingService.goToMyEventsPage();
  }
}
