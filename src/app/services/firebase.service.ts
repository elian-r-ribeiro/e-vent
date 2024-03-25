import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AlertService } from '../common/alert.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private alertService: AlertService, private firestore: AngularFirestore, private storage: AngularFireStorage) { }

  uploadImage(imagem: any){
    const file = imagem.item(0);
    if(file.type.split('/')[0] !== 'image'){
      this.alertService.presentAlert('Erro ao enviar foto de perfil', 'Tipo não suportado');
      return;
    }
    const path = `images/${file.name}`;
    let task = this.storage.upload(path, file);
    return task;
  }
}