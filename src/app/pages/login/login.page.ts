import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/common/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { RoutingService } from 'src/app/services/routing.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm!: FormGroup;

  constructor(private authService: AuthService, private alertService: AlertService, private routingService : RoutingService, private builder: FormBuilder) {
    this.loginForm = new FormGroup({
      email: new FormControl(''),
      password: new FormControl('')
    });
   }

  ngOnInit() {
    this.loginForm = this.builder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  submitForm(){
    if(!this.loginForm.valid){
      this.alertService.presentAlert('Erro ao cadastrar', 'Cheque todos os campos e tente novamente');
    }else{
      this.authService.userLogin(this.loginForm.value['email'], this.loginForm.value['password']);
      this.alertService.presentAlert('Login realizado com sucesso', 'Você será redirecionado para a Home')
      this.routingService.goToHomePage();
    }
  }

  goToRegisterPage(){
    this.routingService.goToRegisterPage();
  }
}
