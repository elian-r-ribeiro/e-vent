import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/compat/firestore';
import { RoutingService } from './routing.service';
import { FirebaseService } from './firebase.service';
import { AlertService } from '../../common/alert.service';
import { Observable, firstValueFrom, map, take } from 'rxjs';
import { OthersService } from 'src/app/common/others.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userData: any;
  userInfo: any;

  constructor(private firebaseService: FirebaseService, private alertService: AlertService, private auth: AngularFireAuth, private firestore: AngularFirestore, private routingService: RoutingService,private othersService: OthersService) {}

  private PATH: string = "users";

  async registerUser(userName: string, email: string, phoneNumber: number, password: string, image: any): Promise<void> {
    const loading = await this.alertService.presentLoadingAlert('Criando conta...');

    if (!this.othersService.checkIfFileTypeIsCorrect(image)) {
      loading.dismiss();
    } else {
      const userData = await this.auth.createUserWithEmailAndPassword(email, password).then(async (userData) => {
        const uid = userData.user?.uid;
        const imageURL = await this.firebaseService.getImageDownloadURL(image, 'profilePictures', uid);
        await this.firestore.collection(this.PATH).add({ userName, email, phoneNumber, imageURL, uid, isUserAdmin: false });
        await userData.user?.sendEmailVerification();
        loading.dismiss();
        this.alertService.presentAlert('Sucesso', 'Um e-mail de confirmação foi enviado para você, verifique antes de fazer login');
        this.routingService.goToLoginPage();
      }).catch(error => {
        let errorMessage: string;
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = 'O email informado já está em uso';
            break;
          default:
            errorMessage = 'Erro ao efetuar registro, por favor, tente novamente mais tarde';
            break;
        }
        this.alertService.presentAlert('Erro de Login', errorMessage);;
        loading.dismiss();
      })
    }
  }

  async userLogin(email: string, password: string): Promise<void> {
    const loading = await this.alertService.presentLoadingAlert('Logando...');
    this.auth.signInWithEmailAndPassword(email, password)
      .then(async (loggedUserInfo) => {
        this.userInfo = loggedUserInfo;
        if(!loggedUserInfo.user?.emailVerified) {
          loading.dismiss();
          this.alertService.presentConfirmAlert('Erro', 'Você precisa verificar seu e-mail antes de logar, clique em "Confirmar" para reenviar a confirmação',
            this.sendEmailValidation.bind(this)
          );
        } else {
          loading.dismiss();
          await this.setItemsOnLocalStorage();
          this.alertService.presentAlert('Login realizado com sucesso', 'Você será redirecionado para a Home');
          this.routingService.goToHomePage();
        }
      })
      .catch(error => {
        let errorMessage: string;
        switch (error.code) {
          case 'auth/invalid-credential':
            errorMessage = 'Usuário não encontrado, verifique seu email e sua senha e tente novamente';
            break;
          case 'auth/too-many-requests':
            errorMessage = 'Você fez muitas solicitações em pouco tempo, tente novamente mais tarde'
            break;
          default:
            errorMessage = 'Erro ao efetuar login, por favor, tente novamente mais tarde';
            break;
        }
        this.alertService.presentAlert('Erro de Login', errorMessage);
      });
  }

  sendEmailValidation(): void {
    this.userInfo.user?.sendEmailVerification();
    this.alertService.presentAlert('Sucesso', 'E-mail de confirmação enviado com sucesso');
  }
  
  async setItemsOnLocalStorage(): Promise<void> {
    const user = await this.auth.currentUser;
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  checkIfUserIsLogged(): void {
    if (this.getLoggedUserThroughLocalStorage() != null) {
      this.routingService.goToHomePage();
      this.alertService.presentAlert('Login detectado', 'Você já está logado, você será redirecionado para a home');
    };
  }

  checkIfUserIsntLogged(): void {
    if (this.getLoggedUserThroughLocalStorage() == null) {
      this.routingService.goToLoginPage();
      this.alertService.presentAlert('Você tentou acessar uma página sem estar logado', 'Para acessar essa página você precisa estar logado, realize o login e tente novamente');
    }
  }

  getLoggedUserThroughLocalStorage() {
    const user: any = JSON.parse(localStorage.getItem('user') || 'null');
    return (user !== null) ? user : null;
  }

  getUserInfoFromFirebaseAlreadySubscribed(): Observable<any[]> {
    return this.getUserInfoFromFirebase().pipe(
      map(res => res.map(user => ({ id: user.payload.doc.id, ...user.payload.doc.data() as any })))
    )
  }

  getUserInfoFromFirebase(): Observable<DocumentChangeAction<unknown>[]> {
    const loggedUserUID = this.getLoggedUserThroughLocalStorage().uid;
    return this.firestore.collection(this.PATH, ref => ref.where('uid', '==', loggedUserUID)).snapshotChanges();
  }

  async isUserAdmin(): Promise<boolean> {
    const userInfoSnapshot = await firstValueFrom(this.getUserInfoFromFirebase());
    const users = userInfoSnapshot.map(user => { return { id: user.payload.doc.id, ...user.payload.doc.data() as any } as any });
    if (users[0].isUserAdmin) {
      return true;
    } else {
      return false;
    }
  }

  async updateProfileWithNoProfilePicture(userName: string, phoneNumber: number, firestoreProfileId: string, uid: string): Promise<void> {
    await this.updateProfile(userName, phoneNumber, firestoreProfileId);
    await this.firebaseService.updateParticipantNameAndPhoneNumber(userName, phoneNumber, uid);
    this.alertService.presentAlert('Perfil atualizado com sucesso', 'Suas informações foram atualizas');
  }

  updateProfile(newUserName: string, newPhoneNumber: number, id: string): Promise<void> {
    return this.firestore.collection(this.PATH).doc(id).update({ userName: newUserName, phoneNumber: newPhoneNumber });
  }

  updateProfilePicture(newImageURL: string, id: string): Promise<void> {
    return this.firestore.collection(this.PATH).doc(id).update({ imageURL: newImageURL });
  }

  resetPassword(email: string): void {
    this.auth.sendPasswordResetEmail(email);
  }

  logout(): void {
    this.auth.signOut();
    localStorage.setItem('user', 'null');
    this.routingService.goToLoginPage();
  }
}
