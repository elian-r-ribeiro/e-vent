import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { RoutingService } from 'src/app/services/routing.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  public pokemonList  = ['Pikachu', 'Charizard', 'Sei lá mais oqueSei lá mais oqueSei lá mais oqueSei lá mais oqueSei lá mais oqueSei lá mais oqueSei lá mais oqueSei lá mais oqueSei lá mais oqueSei lá mais oqueSei lá mais oqueSei lá mais oque', 'Sei lá mais oque', 'Sei lá mais oque', 'Sei lá mais oque', 
  'Sei lá mais oque', 'Sei lá mais oque', 'Sei lá mais oque', 'Sei lá mais oque', 'Sei lá mais oque', 'Sei lá mais oque', 'Sei lá mais oque', 
  'Sei lá mais oque', 'Sei lá mais oque', 'Sei lá mais oque'];

  constructor(private routingService : RoutingService) {
  }

  ngOnInit() {

  }

  goToNewEventPage(){
    this.routingService.goToNewEventPage();
  }

  goToEventPage(){
    this.routingService.goToEventPage();
  }

  goToProfilePage(){
    this.routingService.goToProfilePage();
  }

  goToMyEventsPage(){
    this.routingService.goToMyEventsPage();
  }
}
