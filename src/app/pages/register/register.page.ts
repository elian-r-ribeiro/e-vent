import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { RoutingService } from 'src/app/services/routing.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  registerForm! : FormGroup;

  constructor(private routingService : RoutingService, private authService: AuthService, private builder: FormBuilder) { 
    this.registerForm = new FormGroup({
      email: new FormControl(''),
      password: new FormControl('')
    })
  }

  ngOnInit() {
    this.registerForm = this.builder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get errorControl(){
    return this.registerForm.controls;
  }

  submitForm(){
    if(!this.registerForm.valid){
      console.log('Erro ao registrar');
    }else{
      this.authService.registerUser(this.registerForm.value['email'], this.registerForm.value['password']);
    }
  }

  goToLoginPage(){
    this.routingService.goToLoginPage();
  }
}
