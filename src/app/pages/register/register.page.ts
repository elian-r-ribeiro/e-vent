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

  registerForm!: FormGroup;

  constructor(private routingService: RoutingService, private authService: AuthService, private builder: FormBuilder) {
    this.registerForm = new FormGroup({
      userName: new FormControl(''),
      email: new FormControl(''),
      phoneNumber: new FormControl(''),
      password: new FormControl(''),
      confirmPassword: new FormControl('')
    })
  }

  ngOnInit() {
    this.registerForm = this.builder.group({
      userName: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, this.validatePhoneNumber]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    })
  }

  validatePhoneNumber(control: FormControl): { [s: string]: boolean } | null {
    if (control.value && control.value.toString().trim().length !== 11) {
      return { 'validatePhoneNumber': true };
    }
    return null;
  }

  get errorControl() {
    return this.registerForm.controls;
  }

  submitForm() {
    if (!this.registerForm.valid) {
      console.log('Erro ao registrar');
    } else {
      this.authService.registerUser(this.registerForm.value['email'], this.registerForm.value['password']);
    }
  }

  goToLoginPage() {
    this.routingService.goToLoginPage();
  }
}
