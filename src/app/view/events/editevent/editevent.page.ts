import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/app/common/alert.service';
import { AuthService } from 'src/app/model/services/auth.service';
import { FirebaseService } from 'src/app/model/services/firebase.service';
import { RoutingService } from 'src/app/model/services/routing.service';

@Component({
  selector: 'app-editevent',
  templateUrl: './editevent.page.html',
  styleUrls: ['./editevent.page.scss'],
})
export class EditeventPage implements OnInit {
  eventForm!: FormGroup;
  eventData: any;
  image: any;

  constructor(private firebaseService: FirebaseService, private authService: AuthService, private routingService: RoutingService, private alertService: AlertService, private builder: FormBuilder, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const userId = this.authService.getLoggedUser().uid;
      const eventId = params['eventid'];
      this.firebaseService.getEventInfoById(eventId).subscribe(docSnapshot => {
        this.eventData = { id: docSnapshot.id, ...docSnapshot.data() as any };
        const ownerId = this.eventData.ownerUid;
        const isUserEventOwner = this.firebaseService.isUserEventOwner(userId, ownerId);
        if (!isUserEventOwner) {
          this.alertService.presentAlert('Erro', 'Você tentou editar um evento que não é seu');
          this.routingService.goToHomePage();
        } else {
          this.eventForm.get('eventTitle')?.setValue(this.eventData.eventTitle);
          this.eventForm.get('eventDesc')?.setValue(this.eventData.eventDesc);
          this.eventForm.get('maxParticipants')?.setValue(this.eventData.maxParticipants);
        }
      })
    })


    if (this.authService.getLoggedUser() == null) {
      this.routingService.goToLoginPage();
      this.alertService.presentAlert('Você tentou acessar uma página sem estar logado', 'Para acessar essa página você precisa estar logado, realize o login e tente novamente');
    }

    this.eventForm = this.builder.group({
      eventTitle: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(50)]],
      eventDesc: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(200)]],
      maxParticipants: [null, [Validators.required, Validators.min(2)]],
      eventImage: [null]
    })
  }

  uploadFile(image: any) {
    this.image = image.files;
  }

  showConfirmEventEdit() {
    if (!this.eventForm.valid) {
      this.alertService.presentAlert('Erro ao registrar evento', 'Cheque todos os campos e tente novamente');
    } else {
      this.alertService.presentConfirmAlert('Atenção', 'Tem certeza que deseja editar esse evento? Essa ação não pode ser desfeita. Certifique-se de colocar local, horário e detalhes do evento', this.updateEvent.bind(this));
    }
  }

  async updateEvent() {
    const firestoreEventId = this.eventData.id;
    if (this.image != null) {
      const file = this.image.item(0);
      if (file.type.split('/')[0] !== 'image') {
        this.alertService.presentAlert('Erro ao enviar foto de perfil', 'Tipo não suportado');
      } else {
        const uploadTask = this.firebaseService.uploadImage(this.image, 'eventImages', firestoreEventId);
        await uploadTask?.then(async snapshot => {
          const imageURL = await snapshot.ref.getDownloadURL();
          this.firebaseService.updateEventImage(imageURL, firestoreEventId);
        })
        await this.firebaseService.updateEvent(this.eventForm.value['eventTitle'], this.eventForm.value['eventDesc'], this.eventForm.value['maxParticipants'], firestoreEventId);
        this.alertService.presentAlert('Sucesso', 'Informações do evento editadas com sucesso');
        this.routingService.goBackToPreviousPage();
      }
    } else {
      await this.firebaseService.updateEvent(this.eventForm.value['eventTitle'], this.eventForm.value['eventDesc'], this.eventForm.value['maxParticipants'], firestoreEventId);
      this.alertService.presentAlert('Sucesso', 'Informações do evento editadas com sucesso');
      this.routingService.goBackToPreviousPage();
    }

  }
}