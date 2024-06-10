import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { AlertService } from 'src/app/common/alert.service';
import { OthersService } from 'src/app/common/others.service';
import { AuthService } from 'src/app/model/services/auth.service';
import { RoutingService } from 'src/app/model/services/routing.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  registerForm!: FormGroup;
  image: any;
  isFileSelected = false;
  fileSelectLabelText = "Selecionar foto de perfil";

  constructor(private othersService: OthersService, private routingService: RoutingService, private authService: AuthService, private builder: FormBuilder, private alertService: AlertService) {

  }

  ngOnInit(): void {
    this.othersService.checkAppMode();
    this.authService.checkIfUserIsLogged();
    this.startForm();
  }

  uploadFile(image: any): void {
    this.image = image.files;
  }

  showConfirmAccountRegister(): void {
    this.alertService.presentConfirmAlert("Atenção", "Tem certeza que deseja criar essa conta? Certifique-se de estar usando seu nome real e número e email reais, assim como uma foto de perfil sua (não utilize foto de anime ou qualquer coisa do gênero). Contas irregulares serão deletadas sem aviso prévio", this.submitForm.bind(this));
  }

  submitForm(): void {
    if (!this.registerForm.valid) {
      this.alertService.presentAlert('Erro ao cadastrar', 'Cheque todos os campos e tente novamente');
    } else {
      this.authService.registerUser(this.registerForm.value['userName'], this.registerForm.value['email'], this.registerForm.value['phoneNumber'], this.registerForm.value['password'], this.image);
    }
  }

  goToLoginPage(): void {
    this.routingService.goToLoginPage();
  }

  changeFileInputLabelOnFileSelect(value: string): void {
    this.isFileSelected = this.othersService.changeFileInputStateOnFileSelect(value);
    this.fileSelectLabelText = this.othersService.changeFileInputLabelOnFileSelect(value, "Foto de perfil selecionada", "Selecione a foto de perfil");
  }

  startForm(): void {
    this.registerForm = this.builder.group({
      userName: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      email: ['', [Validators.required, this.validateEmail()]],
      phoneNumber: ['', [Validators.required, this.validatePhoneNumber]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      profileImage: [null, [this.validateImage]]
    });
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

  validateEmail(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const email = control.value;
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const valid = emailPattern.test(email);
      return !valid ? { 'invalidEmail': { value: email } } : null;
    };
  }
}
