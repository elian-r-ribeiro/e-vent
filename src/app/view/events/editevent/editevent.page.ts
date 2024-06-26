import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/common/alert.service';
import { OthersService } from 'src/app/common/others.service';
import { AuthService } from 'src/app/model/services/auth.service';
import { FirebaseService } from 'src/app/model/services/firebase.service';
import { RoutingService } from 'src/app/model/services/routing.service';

@Component({
  selector: 'app-editevent',
  templateUrl: './editevent.page.html',
  styleUrls: ['./editevent.page.scss'],
})
export class EditeventPage implements OnInit, OnDestroy {
  eventForm!: FormGroup;
  eventData: any;
  image: any;
  private subscriptions: Subscription[] = [];
  isFileSelected = false;
  fileSelectLabelText = "Selecionar imagem do evento";
  eventId: string = '';
  originalFormValues: any;

  constructor(private othersService: OthersService, private firebaseService: FirebaseService, private authService: AuthService, private routingService: RoutingService, private alertService: AlertService, private builder: FormBuilder, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.othersService.checkAppMode();
    this.getRouteInfo();
    this.setEventData();
    this.authService.checkIfUserIsntLogged();
    this.startForm();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      if (subscription) {
        subscription.unsubscribe();
      }
    });
  }

  setEventData(): void {
    const getEventInfoByIdSubscription = this.firebaseService.getEventInfoById(this.eventId).subscribe(async docSnapshot => {
      this.eventData = { id: docSnapshot.id, ...docSnapshot.data() as any };
      const ownerId = this.eventData.ownerUid;
      if (!await this.firebaseService.isUserEventOwnerOrAdmin(ownerId)) {
        this.firebaseService.changePageAndGiveWarningIfUserIsntEventOwner();
      } else {
        this.eventForm.get('eventTitle')?.setValue(this.eventData.eventTitle);
        this.eventForm.get('eventDesc')?.setValue(this.eventData.eventDesc);
        this.eventForm.get('maxParticipants')?.setValue(this.eventData.maxParticipants);
        this.eventForm.get('eventLocation')?.setValue(this.eventData.eventLocation);
        this.eventForm.get('eventDate')?.setValue(this.eventData.eventDate);
        this.eventForm.get('eventTime')?.setValue(this.eventData.eventTime);
        this.originalFormValues = this.eventForm.value;
      }
    })
    this.subscriptions.push(getEventInfoByIdSubscription);
  }

  getRouteInfo(): void {
    const routeSubscription = this.route.params.subscribe(params => {
      this.eventId = params['eventid'];
    });
    this.subscriptions.push(routeSubscription);
  }

  uploadFile(image: any): void {
    this.image = image.files;
  }

  showConfirmEventEdit(): void {
    if (!this.eventForm.valid) {
      this.alertService.presentAlert('Erro ao editar evento', 'Cheque todos os campos e tente novamente');
    } else {
      this.alertService.presentConfirmAlert('Atenção', 'Tem certeza que deseja editar esse evento? Essa ação não pode ser desfeita. Certifique-se de colocar local, horário e detalhes do evento', this.updateEvent.bind(this));
    }
  }

  async updateEvent(): Promise<void> {
    const loading = await this.alertService.presentLoadingAlert("Atualizando evento...");

    if(JSON.stringify(this.eventForm.value) === JSON.stringify(this.originalFormValues) && this.image == null){
      loading.dismiss();
      this.alertService.presentAlert("Erro ao editar evento", "Nenhuma alteração foi feita");
    } else {
      const firestoreEventId = this.eventData.id;
      if (this.image != null) {
        if (!this.othersService.checkIfFileTypeIsCorrect(this.image)) {
          loading.dismiss();
        } else {
          const imageURL = await this.firebaseService.getImageDownloadURL(this.image, 'eventImages', firestoreEventId)
          await this.firebaseService.updateEventImage(imageURL, firestoreEventId);
          await this.firebaseService.updateEvent(this.eventForm.value['eventTitle'], this.eventForm.value['eventDesc'], this.eventForm.value['maxParticipants'], this.eventForm.value['eventLocation'], this.eventForm.value['eventDate'], this.eventForm.value['eventTime'], firestoreEventId);
          loading.dismiss();
          this.alertService.presentAlert('Sucesso', 'Informações do evento editadas com sucesso');
          this.routingService.goBackToPreviousPage();
        }
      } else {
        await this.firebaseService.updateEvent(this.eventForm.value['eventTitle'], this.eventForm.value['eventDesc'], this.eventForm.value['maxParticipants'], this.eventForm.value['eventLocation'], this.eventForm.value['eventDate'], this.eventForm.value['eventTime'], firestoreEventId);
        this.alertService.presentAlert('Sucesso', 'Informações do evento editadas com sucesso');
        this.routingService.goBackToPreviousPage();
        loading.dismiss();
      }
    }
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
      eventImage: [null]
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
