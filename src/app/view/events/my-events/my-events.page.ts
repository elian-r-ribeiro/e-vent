import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/common/alert.service';
import { AuthService } from 'src/app/model/services/auth.service';
import { FirebaseService } from 'src/app/model/services/firebase.service';
import { RoutingService } from 'src/app/model/services/routing.service';

@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.page.html',
  styleUrls: ['./my-events.page.scss'],
})
export class MyEventsPage implements OnInit {

  userInfo: any;
  userEvents: any;

  constructor(private firebaseService: FirebaseService, private authService: AuthService, private routingService: RoutingService, private alertService: AlertService) { }

  ngOnInit() {
    if(this.authService.getLoggedUser() == null){
      this.routingService.goToLoginPage();
      this.alertService.presentAlert('Você tentou acessar uma página sem estar logado', 'Para acessar essa página você precisa estar logado, realize o login e tente novamente');
    }
    this.authService.getUserInfo().subscribe(res=>{
      this.userInfo = res.map(userInfo => 
        {return{id:userInfo.payload.doc.id, ...userInfo.payload.doc.data() as any} as any})
    })
    this.firebaseService.getUserEvents().subscribe(res=>{
      this.userEvents = res.map(userEvents => 
        {return{id:userEvents.payload.doc.id, ...userEvents.payload.doc.data() as any} as any})
    })
  }

  public pokemonList  = ['Pikachu', 'Charizard', 'Sei lá mais oqueSei lá mais'];

  goToNewEventPage(){
    this.routingService.goToNewEventPage();
  }

  goToEventPage(index: number){
    this.routingService.goToEventPage(index, 'my-events');
  }

  goToProfilePage(){
    this.routingService.goToProfilePage();
  }

  goToHomePage(){
    this.routingService.goToHomePage();
  }
}
