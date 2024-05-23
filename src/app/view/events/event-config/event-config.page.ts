import { Component, OnDestroy, OnInit } from '@angular/core';
import { DocumentChangeAction } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AlertService } from 'src/app/common/alert.service';
import { AuthService } from 'src/app/model/services/auth.service';
import { FirebaseService } from 'src/app/model/services/firebase.service';
import { RoutingService } from 'src/app/model/services/routing.service';
import { jsPDF } from 'jspdf';
import { OthersService } from 'src/app/common/others.service';

@Component({
  selector: 'app-event-config',
  templateUrl: './event-config.page.html',
  styleUrls: ['./event-config.page.scss'],
})
export class EventConfigPage implements OnInit, OnDestroy {

  cameFrom!: string;
  eventIndex!: number;
  subscriptions: Subscription[] = [];
  eventId!: string;
  participants: any;
  loggedUser = this.authService.getLoggedUserThroughLocalStorage();
  ownerId!: string;
  currentParticipantsNumber!: number
  eventInfo: any;
  participantsNamesArray: any[] = [];
  participantsPhoneNumbersArray: any[] = [];
  participantsEmailsArray: any[] = [];

  constructor(private othersService: OthersService, private route: ActivatedRoute, private firebaseService: FirebaseService, private authService: AuthService, private alertService: AlertService, private routingService: RoutingService) { }

  ngOnInit(): void {
    this.othersService.checkAppMode();
    this.authService.checkIfUserIsntLogged();
    this.getRouteInfo();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  getRouteInfo(): void {
    const routeSubscription = this.route.params.subscribe(res => {
      this.eventIndex = +res['index'];
      this.cameFrom = res['from'];

      if (this.cameFrom == 'home') {
        this.setEventInfo(this.firebaseService.getSomethingFromFirebaseAlreadySubscribed('events'));
      } else {
        this.setEventInfo(this.firebaseService.getSomethingFromFirebaseWithConditionAlreadySubscribed('ownerUid', this.loggedUser.uid, 'events'));
      }
    });
    this.subscriptions.push(routeSubscription);
  }

  setEventInfo(getEventFn: Observable<DocumentChangeAction<unknown>[]>): void {
    const eventSubscription = getEventFn.subscribe(async (res: any[]) => {
      this.eventInfo = res[this.eventIndex];
      this.eventId = this.eventInfo.id;
      this.ownerId = this.eventInfo.ownerUid;
      await this.processParticipants();
    });
    this.subscriptions.push(eventSubscription);
  }

  async processParticipants(): Promise<void> {
    if (!await this.firebaseService.isUserEventOwnerOrAdmin(this.ownerId)) {
      this.firebaseService.changePageAndGiveWarningIfUserIsntEventOwner();
    } else {
      const participantsSubscription = this.firebaseService.getSomethingFromFirebaseWithConditionAlreadySubscribed('eventId', this.eventId, 'participations').subscribe(res => {
        this.currentParticipantsNumber = res.length;
        const participants = res;
        for (let i = 0; i < res.length; i++) {
          this.participantsNamesArray.push(participants[i].participantName);
          this.participantsPhoneNumbersArray.push(participants[i].participantPhoneNumber);
          this.participantsEmailsArray.push(participants[i].participantEmail);
        }
        this.participants = participants;
      })
      this.subscriptions.push(participantsSubscription);
    }
  }

  goToParticipantInfoPage(participantIndex: number): void {
    this.routingService.goToParticipantInfoPage(this.cameFrom, this.eventIndex, participantIndex);
  }

  async showConfirmRemoveParticipant(index: number): Promise<void> {
    const participationId = this.participants[index].id;
    await this.alertService.presentConfirmAlert("Atenção", "Tem certeza que deseja remover esse participante desse evento?", async () => {
      await this.firebaseService.removeEventParticipation(participationId)
      this.alertService.presentAlert("Sucesso", "Participante removido com sucesso");
    });
  }

  async showConfirmChangeParticipationStatus(index: number): Promise<void> {
    const participationId = this.participants[index].id;
    if (this.participants[index].didParticipantWentToEvent == false) {
      await this.alertService.presentConfirmAlert("Atenção", "Essa opção irá alterar o status do participante para 'participou do evento', tem certeza que deseja fazer isso?", async () => {
        this.firebaseService.updateDidParticipantWentToEventToYes(participationId);
      });
    } else {
      await this.alertService.presentConfirmAlert("Atenção", "Essa opção irá alterar o status do participante para 'não participou do evento', tem certeza que deseja fazer isso?", async () => {
        this.firebaseService.updateDidParticipantWentToEventToNo(participationId);
      });
    }

  }

  generatePDF(): jsPDF {
    const doc = new jsPDF();

    let currentYPosition = 10;
    const maxPageHight = 240;

    doc.text(this.eventInfo.eventTitle, 10, currentYPosition);
    currentYPosition += 10;

    for (let i = 0; i < this.currentParticipantsNumber; i++) {
      const participantsNames = String(this.participantsNamesArray[i]);
      const participantsPhoneNumbers = String(this.participantsPhoneNumbersArray[i]);
      const participantsEmails = String(this.participantsEmailsArray[i]);

      doc.text("===========================", 10, currentYPosition);
      currentYPosition += 10;

      doc.text(participantsNames, 10, currentYPosition);
      doc.text(participantsPhoneNumbers, 10, currentYPosition + 10);
      doc.text(participantsEmails, 10, currentYPosition + 20);
      if (this.participants[i].didParticipantWentToEvent) {
        doc.text("Participou? Sim", 10, currentYPosition + 30);
      } else {
        doc.text("Participou? Não", 10, currentYPosition + 30);
      }

      currentYPosition += 40;

      if (currentYPosition > maxPageHight) {
        doc.addPage();
        currentYPosition = 10;
      }
    }

    doc.save(this.eventInfo.eventTitle + ".pdf");
    return doc;
  }

  async uploadFileToFirebaseAndGetDownloadURL(): Promise<void> {
    const loading = await this.alertService.presentLoadingAlert("Gerando PDF...");

    const fileName: string = this.eventInfo.id;
    const pdfBlob = this.generatePDF().output('blob');

    this.firebaseService.uploadPDFAndGetPDFDownloadURL(pdfBlob, fileName).then(downloadURL => {
      window.open(downloadURL, '_blank');
      loading.dismiss();
    });
  }
}
