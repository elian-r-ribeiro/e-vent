import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/common/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { RoutingService } from 'src/app/services/routing.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  registerForm!: FormGroup;
  image: any;

  constructor(private routingService: RoutingService, private authService: AuthService, private builder: FormBuilder, private alertService: AlertService) {
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
      confirmPassword: ['', [Validators.required]],
      profileImage: [null, [this.validateImage]]
    })
  }

  validateImage(control: FormControl): { [s: string]: boolean } | null {
    if (!control.value) {
      return { 'required': true };
    }
    return null;
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

  uploadFile(image: any){
    this.image = image.files;
  }

  submitForm() {
    if (!this.registerForm.valid) {
      this.alertService.presentAlert('Erro ao cadastrar', 'Cheque todos os campos e tente novamente')
    } else {
      this.alertService.presentAlert('Registro concluído com sucesso', 'Você será redirecionado para a página de login')
      this.authService.registerUser(this.registerForm.value['userName'], this.registerForm.value['email'], this.registerForm.value['phoneNumber'], this.registerForm.value['password'], this.image);
      this.routingService.goToLoginPage();
    }
  }

  goToLoginPage() {
    this.routingService.goToLoginPage();
  }
}
