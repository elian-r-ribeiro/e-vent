import { Inject, Injectable, Injector } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AuthService } from './auth.service';
import { AlertService } from '../../common/alert.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { RoutingService } from './routing.service';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  private eventsPath: string = "events";
  private usersPath: string = "users";
  private participationsPath: string = "participations";

  constructor(private loadingController: LoadingController,private routingService: RoutingService, private storage: AngularFireStorage, @Inject(Injector) private readonly injector: Injector, private alertService: AlertService, private firestore: AngularFirestore) { }

  private injectAuthService() {
    return this.injector.get(AuthService);
  }

  uploadImage(image: any, PATH: string, fileName: any) {
    const file = image.item(0);
    const path = `${PATH}/${fileName}`;
    let task = this.storage.upload(path, file);
    return task;
  }

  async deleteEventAndEventImageAndEventParticipations(eventId: string) {
    const completePath = `eventImages/${eventId}`;
    this.storage.ref(completePath).delete();
    await this.firestore.collection(this.eventsPath).doc(eventId).delete();
    const participationsSnapshot = this.firestore.collection(this.participationsPath, ref => ref.where('eventId', '==', eventId));
    const querySnapshot = await participationsSnapshot.get().toPromise();

    for(const doc of querySnapshot!.docs){
      await this.firestore.collection(this.participationsPath).doc(doc.id).delete();
    }
    this.alertService.presentAlert("Sucesso", "Evento deletado com sucesso");
  }

  async registerEvent(eventTitle: string, eventDesc: string, maxParticipants: number, image: any) {
    const loading = await this.loadingController.create({
      message: "Criando evento..."
    });
    await loading.present();

    const ownerUid = this.injectAuthService().getLoggedUser().uid;
    const file = image.item(0);
    if (file.type.split('/')[0] !== 'image') {
      this.alertService.presentAlert('Erro ao enviar imagem do evento', 'Tipo não suportado');
      loading.dismiss();
    } else {
      const eventDocRef = await this.firestore.collection(this.eventsPath).add({ eventTitle, eventDesc, maxParticipants, ownerUid });
      const uploadTask = this.uploadImage(image, 'eventImages', eventDocRef.id);
      uploadTask?.then(async snapshot => {
        const imageURL = await snapshot.ref.getDownloadURL();
        await eventDocRef.update({ imageURL });
        this.alertService.presentAlert('Evento registrado com sucesso', 'Você pode checar mais informações na aba "Meus eventos" e ele já está disponível para outras pessoas');
        this.routingService.goToHomePage();
        loading.dismiss();
      })
    }
  }

  getAllEvents() {
    return this.firestore.collection(this.eventsPath).snapshotChanges();
  }

  getUserEvents() {
    const loggedUserUID = this.injectAuthService().getLoggedUser().uid;
    return this.firestore.collection(this.eventsPath, ref => ref.where('ownerUid', '==', loggedUserUID)).snapshotChanges();
  }

  getEventInfoById(eventId: string) {
    return this.firestore.collection(this.eventsPath).doc(eventId).get();
  }

  getEventOwnerInfo(eventOwnerUID: string) {
    return this.firestore.collection(this.usersPath, ref => ref.where('uid', '==', eventOwnerUID)).snapshotChanges();
  }

  updateEvent(newEventTitle: string, newEventDesc: string, newMaxParticipants: number, eventId: string) {
    return this.firestore.collection(this.eventsPath).doc(eventId).update({ eventTitle: newEventTitle, eventDesc: newEventDesc, maxParticipants: newMaxParticipants });
  }

  updateEventImage(newImageURL: string, eventId: string) {
    return this.firestore.collection(this.eventsPath).doc(eventId).update({ imageURL: newImageURL });
  }

  addEventParticipation(eventId: string, participantId: string, participantName: string, participantPhoneNumber: number, participantEmail: string, participantProfilePicture: string) {
    return this.firestore.collection(this.participationsPath).add({ eventId: eventId, participantId: participantId, participantName: participantName, participantPhoneNumber: participantPhoneNumber, participantEmail: participantEmail, participantProfileImage: participantProfilePicture, didParticipantWentToEvent: false });
  }

  removeEventParticipation(participationId: string) {
    return this.firestore.collection(this.participationsPath).doc(participationId).delete();
  }

  getEventParticipants(eventId: string) {
    return this.firestore.collection(this.participationsPath, ref => ref.where('eventId', '==', eventId)).snapshotChanges();
  }

  async updateParticipantNameAndPhoneNumber(newParticipantName: string, newParticipantPhoneNumber: string, participantId: string) {
    const query = this.firestore.collection(this.participationsPath, ref => ref.where('participantId', '==', participantId));

    const querySnapshot = await query.get().toPromise();

    for (const document of querySnapshot!.docs) {
      await document.ref.update({
        participantName: newParticipantName,
        participantPhoneNumber: newParticipantPhoneNumber
      });
    }
  }

  updateDidParticipantWentToEventToYes(participationId: string){
    return this.firestore.collection(this.participationsPath).doc(participationId).update({didParticipantWentToEvent: true});
  }

  updateDidParticipantWentToEventToNo(participationId: string){
    return this.firestore.collection(this.participationsPath).doc(participationId).update({didParticipantWentToEvent: false});
  }

  getUserAlreadyParticipatingOnEvent(eventId: string, userId: string) {
    return this.firestore.collection(this.participationsPath, ref => ref.where('eventId', '==', eventId).where('participantId', '==', userId)).snapshotChanges();
  }

  isUserEventOwner(userId: string, ownerId: string) {
    if (userId == ownerId) {
      return true;
    } else {
      return false;
    }
  }
}