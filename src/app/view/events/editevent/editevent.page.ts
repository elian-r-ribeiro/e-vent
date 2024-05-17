import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
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

  constructor(private othersService: OthersService, private loadingController: LoadingController, private firebaseService: FirebaseService, private authService: AuthService, private routingService: RoutingService, private alertService: AlertService, private builder: FormBuilder, private route: ActivatedRoute) { }

  ngOnInit() {
    this.othersService.checkAppMode();
    const routeSubscription = this.route.params.subscribe(params => {
      const eventId = params['eventid'];
      const getEventInfoByIdSubscription = this.firebaseService.getEventInfoById(eventId).subscribe(async docSnapshot => {
        this.eventData = { id: docSnapshot.id, ...docSnapshot.data() as any };
        const ownerId = this.eventData.ownerUid;
        if (!await this.firebaseService.isUserEventOwnerOrAdmin(ownerId)) {
          this.firebaseService.changePageAndGiveWarningIfUserIsntEventOwner();
        } else {
          this.eventForm.get('eventTitle')?.setValue(this.eventData.eventTitle);
          this.eventForm.get('eventDesc')?.setValue(this.eventData.eventDesc);
          this.eventForm.get('maxParticipants')?.setValue(this.eventData.maxParticipants);
        }
      })
      this.subscriptions.push(getEventInfoByIdSubscription);
    })
    this.subscriptions.push(routeSubscription);
    this.authService.checkIfUserIsntLoged();
    this.startForm();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      if (subscription) {
        subscription.unsubscribe();
      }
    });
  }

  uploadFile(image: any) {
    this.image = image.files;
  }

  showConfirmEventEdit() {
    if (!this.eventForm.valid) {
      this.alertService.presentAlert('Erro ao editar evento', 'Cheque todos os campos e tente novamente');
    } else {
      this.alertService.presentConfirmAlert('Atenção', 'Tem certeza que deseja editar esse evento? Essa ação não pode ser desfeita. Certifique-se de colocar local, horário e detalhes do evento', this.updateEvent.bind(this));
    }
  }

  async updateEvent() {
    const loading = await this.alertService.presentLoadingAlert("Atualizando evento...");

    const firestoreEventId = this.eventData.id;
    if (this.image != null) {
      if (!this.othersService.checkIfFileTypeIsCorrect(this.image)) {
        loading.dismiss();
      } else {
        const imageURL = await this.firebaseService.getImageDownloadURL(this.image, 'eventImages', firestoreEventId)
        await this.firebaseService.updateEventImage(imageURL, firestoreEventId);
        await this.firebaseService.updateEvent(this.eventForm.value['eventTitle'], this.eventForm.value['eventDesc'], this.eventForm.value['maxParticipants'], firestoreEventId);
        this.alertService.presentAlert('Sucesso', 'Informações do evento editadas com sucesso');
        this.routingService.goBackToPreviousPage();
        loading.dismiss();
      }
    } else {
      await this.firebaseService.updateEvent(this.eventForm.value['eventTitle'], this.eventForm.value['eventDesc'], this.eventForm.value['maxParticipants'], firestoreEventId);
      this.alertService.presentAlert('Sucesso', 'Informações do evento editadas com sucesso');
      this.routingService.goBackToPreviousPage();
      loading.dismiss();
    }

  }

  changeFileInputLabelOnFileSelect(value: string) {
    this.isFileSelected = this.othersService.changeFileInputStateOnFileSelect(value);
    this.fileSelectLabelText = this.othersService.changeFileInputLabelOnFileSelect(value, "Imagem do evento selecionada", "Selecione a imagem do evento");
  }

  startForm() {
    this.eventForm = this.builder.group({
      eventTitle: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(50)]],
      eventDesc: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(200)]],
      maxParticipants: [null, [Validators.required, Validators.min(2)]],
      eventImage: [null]
    });
  }
}
