import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AlertService } from '../common/alert.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private storage: AngularFireStorage) { }

  uploadImage(imagem: any){
    const file = imagem.item(0);
    const path = `images/${file.name}`;
    let task = this.storage.upload(path, file);
    return task;
  }
}