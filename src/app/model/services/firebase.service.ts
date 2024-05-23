import { Inject, Injectable, Injector } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { AuthService } from './auth.service';
import { AlertService } from '../../common/alert.service';
import { AngularFirestore, DocumentChangeAction, DocumentReference } from '@angular/fire/compat/firestore';
import { RoutingService } from './routing.service';
import { OthersService } from 'src/app/common/others.service';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  private eventsPath: string = "events";
  private participationsPath: string = "participations";

  constructor(private othersService: OthersService, private routingService: RoutingService, private storage: AngularFireStorage, @Inject(Injector) private readonly injector: Injector, private alertService: AlertService, private firestore: AngularFirestore) { }

  private injectAuthService(): AuthService {
    return this.injector.get(AuthService);
  }

  async getImageDownloadURL(image: any, path: string, uidOrId?: string): Promise<string> {
    var imageURL: string = '';
    const uploadTask = this.uploadImage(image, path, uidOrId);
    await uploadTask?.then(async snapshot => {
      imageURL = await snapshot.ref.getDownloadURL();
    })
    return imageURL;
  }

  async uploadPDFAndGetPDFDownloadURL(file: any, fileName: string): Promise<string> {
    var pdfURL: string = '';
    const uploadTask = this.uploadPDF(file, fileName);
    await uploadTask?.then(async snapshot => {
      pdfURL = await snapshot.ref.getDownloadURL();
    });
    return pdfURL;
  }

  uploadImage(image: any, PATH: string, fileName: any): AngularFireUploadTask {
    const file = image.item(0);
    const path = `${PATH}/${fileName}`;
    let task = this.storage.upload(path, file);
    return task;
  }

  uploadPDF(pdfFile: any, fileName: string): AngularFireUploadTask {
    const path = `${'pdfFiles'}/${fileName}`
    let uploadTask = this.storage.upload(path, pdfFile);
    return uploadTask;
  }

  deletePDFFile(fileName: string): void {
    const path = `${'pdfFiles'}/${fileName}`;
    this.storage.ref(path).delete();
  }

  async deleteEventAndEventImageAndEventParticipations(eventId: string): Promise<void> {
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

  async registerEvent(eventTitle: string, eventDesc: string, maxParticipants: number, image: any): Promise<void> {
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

  getSomethingFromFirebaseWithConditionAlreadySubscribed(condition: string, equalsTo: string, path: string): Observable<any[]> {
    return this.getSomethingFromFirebaseWithCondition(condition, equalsTo, path).pipe(
      map(res => res.map(snapshot => ({ id: snapshot.payload.doc.id, ...snapshot.payload.doc.data() as any })))
    );
  }

  getSomethingFromFirebaseWithCondition(condition: string, equalsTo: string, path: string): Observable<DocumentChangeAction<unknown>[]> {
    return this.firestore.collection(path, ref => ref.where(condition, '==', equalsTo)).snapshotChanges();
  }

  getSomethingFromFirebaseAlreadySubscribed(path: string) {
    return this.getSomethingFromFirebase(path).pipe(
      map(res => res.map(snapshot => ({ id: snapshot.payload.doc.id, ...snapshot.payload.doc.data() as any })))
    );
  }

  getSomethingFromFirebase(path: string): Observable<DocumentChangeAction<unknown>[]> {
    return this.firestore.collection(path).snapshotChanges();
  }

  getEventInfoById(eventId: string) {
    return this.firestore.collection(this.eventsPath).doc(eventId).get();
  }

  updateEvent(newEventTitle: string, newEventDesc: string, newMaxParticipants: number, eventId: string): Promise<void> {
    return this.firestore.collection(this.eventsPath).doc(eventId).update({ eventTitle: newEventTitle, eventDesc: newEventDesc, maxParticipants: newMaxParticipants });
  }

  updateEventImage(newImageURL: string, eventId: string): Promise<void> {
    return this.firestore.collection(this.eventsPath).doc(eventId).update({ imageURL: newImageURL });
  }

  addEventParticipation(eventId: string, participantId: string, participantName: string, participantPhoneNumber: number, participantEmail: string, participantProfilePicture: string): Promise<DocumentReference<unknown>> {
    return this.firestore.collection(this.participationsPath).add({ eventId: eventId, participantId: participantId, participantName: participantName, participantPhoneNumber: participantPhoneNumber, participantEmail: participantEmail, participantProfileImage: participantProfilePicture, didParticipantWentToEvent: false });
  }

  removeEventParticipation(participationId: string): Promise<void> {
    return this.firestore.collection(this.participationsPath).doc(participationId).delete();
  }

  async updateParticipantNameAndPhoneNumber(newParticipantName: string, newParticipantPhoneNumber: number, participantId: string): Promise<void> {
    const query = this.firestore.collection(this.participationsPath, ref => ref.where('participantId', '==', participantId));

    const querySnapshot = await query.get().toPromise();

    for (const document of querySnapshot!.docs) {
      await document.ref.update({
        participantName: newParticipantName,
        participantPhoneNumber: newParticipantPhoneNumber
      });
    }
  }

  updateDidParticipantWentToEventToYes(participationId: string): Promise<void> {
    return this.firestore.collection(this.participationsPath).doc(participationId).update({ didParticipantWentToEvent: true });
  }

  updateDidParticipantWentToEventToNo(participationId: string): Promise<void> {
    return this.firestore.collection(this.participationsPath).doc(participationId).update({ didParticipantWentToEvent: false });
  }

  getUserAlreadyParticipatingOnEventAlreadySubscribed(eventId: string, userId: string): Observable<any[]> {
    return this.getUserAlreadyParticipatingOnEvent(eventId, userId).pipe(
      map(res => res.map(participant => ({ id: participant.payload.doc.id, ...participant.payload.doc.data() as any })))
    );
  }

  getUserAlreadyParticipatingOnEvent(eventId: string, userId: string): Observable<DocumentChangeAction<unknown>[]> {
    return this.firestore.collection(this.participationsPath, ref => ref.where('eventId', '==', eventId).where('participantId', '==', userId)).snapshotChanges();
  }

  changePageAndGiveWarningIfUserIsntEventOwner(): void {
    this.alertService.presentAlert("Erro", "Esse evento não é seu");
    this.routingService.goToHomePage();
  }

  async isUserEventOwnerOrAdmin(ownerId: string): Promise<boolean> {
    const isUserAdmin: boolean = await this.enableOwnerOptionsIfUserIsAdmin()
    const loggedUserID: string = await this.injectAuthService().getLoggedUserThroughLocalStorage().uid;
    if (loggedUserID == ownerId || isUserAdmin) {
      return true;
    } else {
      return false;
    }
  }

  async enableOwnerOptionsIfUserIsAdmin(): Promise<boolean> {
    if (await this.injectAuthService().isUserAdmin()) {
      return true;
    } else {
      return false;
    }
  }
}