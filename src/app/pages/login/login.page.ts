import { Component, OnInit } from '@angular/core';
import { RoutingService } from 'src/app/services/routing.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private routingService : RoutingService) { }

  ngOnInit() {
  }

  goToRegisterPage(){
    this.routingService.goToRegisterPage();
  }
}
