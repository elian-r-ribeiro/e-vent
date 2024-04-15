import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/common/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { RoutingService } from 'src/app/services/routing.service';

@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.page.html',
  styleUrls: ['./my-events.page.scss'],
})
export class MyEventsPage implements OnInit {

  constructor(private authService: AuthService, private routingService: RoutingService, private alertService: AlertService) { }

  ngOnInit() {
    if(this.authService.getLoggedUser() == null){
      this.routingService.goToLoginPage();
      this.alertService.presentAlert('Você tentou acessar uma página sem estar logado', 'Para acessar essa página você precisa estar logado, realize o login e tente novamente');
    }
  }

  public pokemonList  = ['Pikachu', 'Charizard', 'Sei lá mais oqueSei lá mais'];

  goToNewEventPage(){
    this.routingService.goToNewEventPage();
  }

  goToEventPage(){
    this.routingService.goToEventPage();
  }

  goToProfilePage(){
    this.routingService.goToProfilePage();
  }

  goToHomePage(){
    this.routingService.goToHomePage();
  }
}
