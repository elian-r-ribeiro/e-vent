import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private firestore: AngularFirestore, private storage: AngularFireStorage) { }

  uploadImage(imagem: any){
    const file = imagem.item(0);
    if(file.type.split('/')[0] !== 'image'){
      console.error("Tipo não suportado!");
      return;
    }
    const path = `images/${file.name}`;
    const fileRef = this.storage.ref(path);
    let task = this.storage.upload(path, file);
    return task;
  }
}