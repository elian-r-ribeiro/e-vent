import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/common/alert.service';
import { OthersService } from 'src/app/common/others.service';
import { AuthService } from 'src/app/model/services/auth.service';
import { RoutingService } from 'src/app/model/services/routing.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm!: FormGroup;

  constructor(private othersService: OthersService, private authService: AuthService, private alertService: AlertService, private routingService : RoutingService, private builder: FormBuilder) {

   }

  ngOnInit() {
    this.othersService.checkAppMode();
    if (this.authService.getLoggedUser() != null) {
      this.routingService.goToHomePage();
      this.alertService.presentAlert('Login detectado', 'Você já está logado, você será redirecionado para a home');
    };

    this.loginForm = this.builder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  submitForm(){
    if(!this.loginForm.valid){
      this.alertService.presentAlert('Erro ao cadastrar', 'Cheque todos os campos e tente novamente');
    }else{
      this.authService.userLogin(this.loginForm.value['email'], this.loginForm.value['password']);
    }
  }

  goToRegisterPage(){
    this.routingService.goToRegisterPage();
  }

  goToPasswordResetPage(){
    this.routingService.goToResetPasswordPage();
  }
}
