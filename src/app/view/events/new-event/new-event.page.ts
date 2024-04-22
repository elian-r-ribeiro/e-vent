import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertService } from 'src/app/common/alert.service';
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

  constructor(private builder: FormBuilder, private alertService: AlertService, private firebaseService: FirebaseService, private authService: AuthService, private routingService: RoutingService) {

   }

  ngOnInit() {
    if(this.authService.getLoggedUser() == null){
      this.routingService.goToLoginPage();
      this.alertService.presentAlert('Você tentou acessar uma página sem estar logado', 'Para acessar essa página você precisa estar logado, realize o login e tente novamente');
    }

    this.eventForm = this.builder.group({
      eventTitle: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(50)]],
      eventDesc: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(200)]],
      maxParticipants: [null, [Validators.required, Validators.min(2)]],
      eventImage: [null, [this.validateImage]]
    })
  }

  validateImage(control: FormControl): { [s: string]: boolean } | null {
    if (!control.value) {
      return { 'required': true };
    }
    return null;
  }

  uploadFile(image: any){
    this.image = image.files;
  }

  submitForm(){
    if(!this.eventForm.valid){
      this.alertService.presentAlert('Erro ao registrar evento', 'Cheque todos os campos e tente novamente');
    }else{
      this.firebaseService.registerEvent(this.eventForm.value['eventTitle'], this.eventForm.value['eventDesc'], this.eventForm.value['maxParticipants'], this.image);
    }
  }

}
