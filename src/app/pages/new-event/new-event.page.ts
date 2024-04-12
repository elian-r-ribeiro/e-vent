import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertService } from 'src/app/common/alert.service';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-new-event',
  templateUrl: './new-event.page.html',
  styleUrls: ['./new-event.page.scss'],
})
export class NewEventPage implements OnInit {

  eventForm!: FormGroup;
  image: any;

  constructor(private builder: FormBuilder, private alertService: AlertService, private firebaseService: FirebaseService) {

   }

  ngOnInit() {
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
