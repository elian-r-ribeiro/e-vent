import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { RoutingService } from 'src/app/services/routing.service';

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
  userInfo: any;

  constructor(private routingService: RoutingService, private authService: AuthService) {
  }

  ngOnInit() {
    this.user = this.authService.getLoggedUser();
  }

  goToNewEventPage() {
    this.routingService.goToNewEventPage();
  }

  goToEventPage() {
    this.routingService.goToEventPage();
  }

  goToProfilePage() {
    this.routingService.goToProfilePage();
  }

  goToMyEventsPage() {
    this.routingService.goToMyEventsPage();
  }
}
