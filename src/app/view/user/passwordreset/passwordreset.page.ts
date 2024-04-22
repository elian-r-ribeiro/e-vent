import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/common/alert.service';
import { AuthService } from 'src/app/model/services/auth.service';
import { RoutingService } from 'src/app/model/services/routing.service';

@Component({
  selector: 'app-passwordreset',
  templateUrl: './passwordreset.page.html',
  styleUrls: ['./passwordreset.page.scss'],
})
export class PasswordresetPage implements OnInit {

  passwordResetForm!: FormGroup;

  constructor(private builder: FormBuilder, private authService: AuthService, private alertService: AlertService, private routingService: RoutingService) { }

  ngOnInit() {
    this.passwordResetForm = this.builder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  submitForm() {
    if (!this.passwordResetForm.valid) {
      this.alertService.presentAlert('Erro ao enviar e-mail', 'Cheque o campo e tente novamente');
    } else {
      this.authService.resetPassword(this.passwordResetForm.value['email']);
      this.alertService.presentAlert('Sucesso', 'E-mail para resetar senha enviado com sucesso');
      this.routingService.goToLoginPage();
    }
  }

}