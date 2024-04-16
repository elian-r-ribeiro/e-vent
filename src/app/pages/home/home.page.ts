import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/common/alert.service';
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

  constructor(private routingService: RoutingService, private authService: AuthService, private alertService: AlertService) {
  }

  ngOnInit() {
    this.user = this.authService.getLoggedUser();
    if(this.user == null){
      this.routingService.goToLoginPage();
      this.alertService.presentAlert('Você tentou acessar uma página sem estar logado', 'Para acessar essa página você precisa estar logado, realize o login e tente novamente');
    }
    this.authService.getUserInfo().subscribe(resp=>{
      //TODO
    })
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
