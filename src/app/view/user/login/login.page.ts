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

  ngOnInit(): void {
    this.othersService.checkAppMode();
    this.authService.checkIfUserIsLogged();
    this.startForm();
  }

  submitForm(): void {
    if(!this.loginForm.valid){
      this.alertService.presentAlert('Erro ao logar', 'Cheque todos os campos e tente novamente');
    }else{
      this.authService.userLogin(this.loginForm.value['email'], this.loginForm.value['password']);
    }
  }

  goToRegisterPage(): void {
    this.routingService.goToRegisterPage();
  }

  goToPasswordResetPage(): void {
    this.routingService.goToResetPasswordPage();
  }

  startForm(): void {
    this.loginForm = this.builder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
}
