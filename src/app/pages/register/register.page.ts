import { Component, OnInit } from '@angular/core';
import { RoutingService } from 'src/app/services/routing.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  constructor(private routingService : RoutingService) { }

  ngOnInit() {
  }

  goToLoginPage(){
    this.routingService.goToLoginPage();
  }
}
