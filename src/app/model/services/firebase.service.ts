import { Inject, Injectable, Injector } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AuthService } from './auth.service';
import { AlertService } from '../../common/alert.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { RoutingService } from './routing.service';
import { LoadingController } from '@ionic/angular';
import { OthersService } from 'src/app/common/others.service';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  private eventsPath: string = "events";
  private usersPath: string = "users";
  private participationsPath: string = "participations";

  constructor(private othersService: OthersService, private loadingController: LoadingController, private routingService: RoutingService, private storage: AngularFireStorage, @Inject(Injector) private readonly injector: Injector, private alertService: AlertService, private firestore: AngularFirestore) { }

  private injectAuthService() {
    return this.injector.get(AuthService);
  }

  async getImageDownloadURL(image: any, path: string, uidOrId?: string) {
    var imageURL: string = '';
    const uploadTask = this.uploadImage(image, path, uidOrId);
    await uploadTask?.then(async snapshot => {
      imageURL = await snapshot.ref.getDownloadURL();
    })
    return imageURL;
  }

  async uploadPDFAndGetPDFDownloadURL(file: any, fileName: string) {
    var pdfURL: string = '';
    const uploadTask = this.uploadPDF(file, fileName);
    await uploadTask?.then(async snapshot => {
      pdfURL = await snapshot.ref.getDownloadURL();
    });
    return pdfURL;
  }

  uploadImage(image: any, PATH: string, fileName: any) {
    const file = image.item(0);
    const path = `${PATH}/${fileName}`;
    let task = this.storage.upload(path, file);
    return task;
  }

  uploadPDF(pdfFile: any, fileName: string) {
    const path = `${'pdfFiles'}/${fileName}`
    let uploadTask = this.storage.upload(path, pdfFile);
    return uploadTask;
  }

  deletePDFFile(fileName: string) {
    const path = `${'pdfFiles'}/${fileName}`;
    this.storage.ref(path).delete();
  }

  async deleteEventAndEventImageAndEventParticipations(eventId: string) {
    const completeImagePath = `eventImages/${eventId}`;
    const completePDFPath = `pdfFiles/${eventId}`
    this.storage.ref(completeImagePath).delete();
    this.storage.ref(completePDFPath).delete();
    await this.firestore.collection(this.eventsPath).doc(eventId).delete();
    const participationsSnapshot = this.firestore.collection(this.participationsPath, ref => ref.where('eventId', '==', eventId));
    const querySnapshot = await participationsSnapshot.get().toPromise();

    for (const doc of querySnapshot!.docs) {
      await this.firestore.collection(this.participationsPath).doc(doc.id).delete();
    }
    this.alertService.presentAlert("Sucesso", "Evento deletado com sucesso");
  }

  async registerEvent(eventTitle: string, eventDesc: string, maxParticipants: number, image: any) {
    const loading = await this.alertService.presentLoadingAlert("Registrando evento...");

    const ownerUid = this.injectAuthService().getLoggedUserThroughLocalStorage().uid;
    if (!this.othersService.checkIfFileTypeIsCorrect(image)) {
      loading.dismiss()
    } else {
      const eventDocRef = await this.firestore.collection(this.eventsPath).add({ eventTitle, eventDesc, maxParticipants, ownerUid });
      const imageURL = await this.getImageDownloadURL(image, 'eventImages', eventDocRef.id);
      await eventDocRef.update({ imageURL });
      this.alertService.presentAlert('Evento registrado com sucesso', 'Você pode checar mais informações na aba "Meus eventos" e ele já está disponível para outras pessoas');
      this.routingService.goToHomePage();
      loading.dismiss();
    }
  }

  getAllEventsAlreadySubscribed(): Observable<any[]> {
    return this.getAllEvents().pipe(
      map(res => res.map(event => ({ id: event.payload.doc.id, ...event.payload.doc.data() as any })))
    );
  }

  getAllEvents() {
    return this.firestore.collection(this.eventsPath).snapshotChanges();
  }

  getUserEventsAlreadySubscribed() {
    return this.getUserEvents().pipe(
      map(res => res.map(event => ({ id: event.payload.doc.id, ...event.payload.doc.data() as any })))
    );
  }

  getUserEvents() {
    const loggedUserUID = this.injectAuthService().getLoggedUserThroughLocalStorage().uid;
    return this.firestore.collection(this.eventsPath, ref => ref.where('ownerUid', '==', loggedUserUID)).snapshotChanges();
  }

  getEventInfoById(eventId: string) {
    return this.firestore.collection(this.eventsPath).doc(eventId).get();
  }

  getEventOwnerInfoAlreadySubscribed(eventOwnerUID: string) {
    return this.getEventOwnerInfo(eventOwnerUID).pipe(
      map(res => res.map(owner => ({ id: owner.payload.doc.id, ...owner.payload.doc.data() as any })))
    );
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

  getEventParticipantsAlreadySubscribed(eventId: string) {
    return this.getEventParticipants(eventId).pipe(
      map(res => res.map(participant => ({ id: participant.payload.doc.id, ...participant.payload.doc.data() as any })))
    );
  }

  getEventParticipants(eventId: string) {
    return this.firestore.collection(this.participationsPath, ref => ref.where('eventId', '==', eventId)).snapshotChanges();
  }

  async updateParticipantNameAndPhoneNumber(newParticipantName: string, newParticipantPhoneNumber: number, participantId: string) {
    const query = this.firestore.collection(this.participationsPath, ref => ref.where('participantId', '==', participantId));

    const querySnapshot = await query.get().toPromise();

    for (const document of querySnapshot!.docs) {
      await document.ref.update({
        participantName: newParticipantName,
        participantPhoneNumber: newParticipantPhoneNumber
      });
    }
  }

  updateDidParticipantWentToEventToYes(participationId: string) {
    return this.firestore.collection(this.participationsPath).doc(participationId).update({ didParticipantWentToEvent: true });
  }

  updateDidParticipantWentToEventToNo(participationId: string) {
    return this.firestore.collection(this.participationsPath).doc(participationId).update({ didParticipantWentToEvent: false });
  }

  getUserAlreadyParticipatingOnEventAlreadySubscribed(eventId: string, userId: string) {
    return this.getUserAlreadyParticipatingOnEvent(eventId, userId).pipe(
      map(res => res.map(participant => ({ id: participant.payload.doc.id, ...participant.payload.doc.data() as any })))
    );
  }

  getUserAlreadyParticipatingOnEvent(eventId: string, userId: string) {
    return this.firestore.collection(this.participationsPath, ref => ref.where('eventId', '==', eventId).where('participantId', '==', userId)).snapshotChanges();
  }

  changePageAndGiveWarningIfUserIsntEventOwner() {
    this.alertService.presentAlert("Erro", "Esse evento não é seu");
    this.routingService.goToHomePage();
  }

  async isUserEventOwnerOrAdmin(ownerId: string) {
    const isUserAdmin: boolean = await this.enableOwnerOptionsIfUserIsAdmin()
    const logedUserID: string = await this.injectAuthService().getLoggedUserThroughLocalStorage().uid;
    if (logedUserID == ownerId || isUserAdmin) {
      return true;
    } else {
      return false;
    }
  }

  async enableOwnerOptionsIfUserIsAdmin() {
    if (await this.injectAuthService().isUserAdmin()) {
      return true;
    } else {
      return false;
    }
  }
}