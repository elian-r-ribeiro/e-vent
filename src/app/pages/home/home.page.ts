import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RoutingService } from 'src/app/services/routing.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public pokemonList  = ['Pikachu', 'Charizard', 'Sei lá mais oque', 'Sei lá mais oque', 'Sei lá mais oque', 'Sei lá mais oque', 
  'Sei lá mais oque', 'Sei lá mais oque', 'Sei lá mais oque', 'Sei lá mais oque', 'Sei lá mais oque', 'Sei lá mais oque', 'Sei lá mais oque', 
  'Sei lá mais oque', 'Sei lá mais oque', 'Sei lá mais oque'];

  constructor(private routingService : RoutingService) {}

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
