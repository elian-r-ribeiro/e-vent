import { Component, OnInit } from '@angular/core';
import { RoutingService } from 'src/app/services/routing.service';

@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.page.html',
  styleUrls: ['./my-events.page.scss'],
})
export class MyEventsPage implements OnInit {

  constructor(private routingService : RoutingService) { }

  ngOnInit() {
  }

  public pokemonList  = ['Pikachu', 'Charizard', 'Sei lá mais oqueSei lá mais oqueSei lá mais oqueSei lá mais oqueSei lá mais oqueSei lá mais oqueSei lá mais oqueSei lá mais oqueSei lá mais oqueSei lá mais oqueSei lá mais oqueSei lá mais oque', 'Sei lá mais oque', 'Sei lá mais oque', 'Sei lá mais oque', 
  'Sei lá mais oque', 'Sei lá mais oque', 'Sei lá mais oque', 'Sei lá mais oque', 'Sei lá mais oque', 'Sei lá mais oque', 'Sei lá mais oque', 
  'Sei lá mais oque', 'Sei lá mais oque', 'Sei lá mais oque'];

  goToNewEventPage(){
    this.routingService.goToNewEventPage();
  }

  goToEventPage(){
    this.routingService.goToEventPage();
  }

  goToProfilePage(){
    this.routingService.goToProfilePage();
  }
}
