import { Inject, Injectable, Injector } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AuthService } from './auth.service';
import { AlertService } from '../common/alert.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { RoutingService } from './routing.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  private PATH: string = "events";

  constructor(private routingService: RoutingService, private storage: AngularFireStorage, @Inject(Injector) private readonly injector: Injector, private alertService: AlertService, private firestore: AngularFirestore) { }

  private injectAuthService(){
    return this.injector.get(AuthService);
  }

  uploadImage(image: any, PATH: string, fileName: any){
    const file = image.item(0);
    const path = `${PATH}/${fileName}`;
    let task = this.storage.upload(path, file);
    return task;
  }

  registerEvent(eventTitle: string, eventDesc: string, maxParticipants: number, image: any){
    const ownerUid = this.injectAuthService().getLoggedUser().uid;
    const file = image.item(0);
    if (file.type.split('/')[0] !== 'image') {
      this.alertService.presentAlert('Erro ao enviar imagem do evento', 'Tipo não suportado');
    } else {
      const uploadTask = this.uploadImage(image, 'eventImages', 'temporaryName');
      uploadTask?.then(async snapshot => {
        const imageURL = await snapshot.ref.getDownloadURL();
        await this.firestore.collection(this.PATH).add({ eventTitle, eventDesc, maxParticipants, imageURL, ownerUid });
        this.alertService.presentAlert('Evento registrado com sucesso', 'Você pode checar mais informações na aba "Meus eventos" e ele já está disponível para outras pessoas');
        this.routingService.goToHomePage();
      })
    }
  }

  getAllEvents(){
    return this.firestore.collection(this.PATH).snapshotChanges();
  }

  getUserEvents(){
    const loggedUserUID = this.injectAuthService().getLoggedUser().uid;
    return this.firestore.collection(this.PATH, ref => ref.where('ownerUid', '==', loggedUserUID)).snapshotChanges();
  }
}