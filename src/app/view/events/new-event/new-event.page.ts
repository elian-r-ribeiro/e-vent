import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { AlertService } from 'src/app/common/alert.service';
import { OthersService } from 'src/app/common/others.service';
import { AuthService } from 'src/app/model/services/auth.service';
import { FirebaseService } from 'src/app/model/services/firebase.service';
import { RoutingService } from 'src/app/model/services/routing.service';

@Component({
  selector: 'app-new-event',
  templateUrl: './new-event.page.html',
  styleUrls: ['./new-event.page.scss'],
})
export class NewEventPage implements OnInit {

  eventForm!: FormGroup;
  image: any;
  isFileSelected = false;
  fileSelectLabelText = "Selecionar imagem do evento";
  darkMode: boolean = false;


  constructor(private othersService: OthersService, private builder: FormBuilder, private alertService: AlertService, private firebaseService: FirebaseService, private authService: AuthService, private routingService: RoutingService) {

   }

  ngOnInit(): void {
    this.darkMode = this.othersService.checkAppMode();
    this.authService.checkIfUserIsntLogged();
    this.startForm();
  }

  validateImage(control: FormControl): { [s: string]: boolean } | null {
    if (!control.value) {
      return { 'required': true };
    }
    return null;
  }

  uploadFile(image: any): void {
    this.image = image.files;
  }

  showConfirmEventCreation(): void {
    if(!this.eventForm.valid){
      this.alertService.presentAlert('Erro ao registrar evento', 'Cheque todos os campos e tente novamente');
    }else{
      this.alertService.presentConfirmAlert('Atenção', 'Tem certeza que deseja criar esse evento? Certifique-se de ter colocado local, horário e detalhes do evento', this.createEvent.bind(this));
    }
  }

  createEvent(): void {
    this.firebaseService.registerEvent(this.eventForm.value['eventTitle'], this.eventForm.value['eventDesc'], this.eventForm.value['maxParticipants'], this.eventForm.value['eventLocation'], this.eventForm.value['eventDate'], this.eventForm.value['eventTime'], this.image);
  }

  changeFileInputLabelOnFileSelect(value: string): void {
    this.isFileSelected = this.othersService.changeFileInputStateOnFileSelect(value);
    this.fileSelectLabelText = this.othersService.changeFileInputLabelOnFileSelect(value, "Imagem do evento selecionada", "Selecione a imagem do evento");
  }

  startForm(): void {
    this.eventForm = this.builder.group({
      eventTitle: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(50)]],
      eventDesc: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(200)]],
      maxParticipants: [null, [Validators.required, Validators.min(2)]],
      eventLocation: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(50)]],
      eventDate: [null, [Validators.required, this.dateValidator()]],
      eventTime: [null, [Validators.required, this.timeValidator()]],
      eventImage: [null, [this.validateImage]]
    })
  }

  dateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const datePattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
      const valid = datePattern.test(control.value);
      return valid ? null : { invalidDate: true };
    }
  }

  timeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
      const valid = timePattern.test(control.value);
      return valid ? null : { invalidTime: true };
    }
  }
  
  goBackToPreviousPage() {
    this.routingService.goBackToPreviousPage();
  }
}
