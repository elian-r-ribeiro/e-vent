import { Injectable, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { RoutingService } from './routing.service';
import { FirebaseService } from './firebase.service';
import { AlertService } from '../../common/alert.service';
import { LoadingController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { OthersService } from 'src/app/common/others.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit {

  userData: any;
  userInfo: any;

  constructor(private firebaseService: FirebaseService, private alertService: AlertService, private auth: AngularFireAuth,
    private firestore: AngularFirestore, private routingService: RoutingService, private loadingController: LoadingController,
    private othersService: OthersService) {
    this.auth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
      } else {
        localStorage.setItem('user', 'null');
      }
    });
  }

  ngOnInit() {

  }

  private PATH: string = "users";

  async registerUser(userName: string, email: string, phoneNumber: number, password: string, image: any) {
    const loading = await this.alertService.presentLoadingAlert('Criando conta...');

    if (!this.othersService.checkIfFileTypeIsCorrect(image)) {
      loading.dismiss();
    } else {
      const userData = await this.auth.createUserWithEmailAndPassword(email, password).then(async (userData) => {
        const uid = userData.user?.uid;
        const imageURL = await this.firebaseService.getImageDownloadURL(image, 'profilePictures' , uid);
        await this.firestore.collection(this.PATH).add({ userName, email, phoneNumber, imageURL, uid, isUserAdmin: false });
        this.userLogin(email, password);
        loading.dismiss();
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

  userLogin(email: string, password: string) {
    this.auth.signInWithEmailAndPassword(email, password)
      .then(() => {
        this.alertService.presentAlert('Login realizado com sucesso', 'Você será redirecionado para a Home');
        this.auth.authState.subscribe(user => {
          if (user) {
            this.userData = user;
            localStorage.setItem('user', JSON.stringify(this.userData));
          } else {
            localStorage.setItem('user', 'null');
          }
        });
        this.routingService.goToHomePage();
      })
      .catch(error => {
        let errorMessage: string;
        switch (error.code) {
          case 'auth/invalid-credential':
            errorMessage = 'Usuário não encontrado, verifique seu email e sua senha e tente novamente';
            break;
          default:
            errorMessage = 'Erro ao efetuar login, por favor, tente novamente mais tarde';
            break;
        }
        this.alertService.presentAlert('Erro de Login', errorMessage);
      });
  }

  getLoggedUserThroughLocalStorage() {
    const user: any = JSON.parse(localStorage.getItem('user') || 'null');
    return (user !== null) ? user : null;
  }

  getUserInfoFromFirebase() {
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

  async updateProfileWithNoProfilePicture(userName: string, phoneNumber: number, firestoreProfileId: string, uid: string){
    await this.updateProfile(userName, phoneNumber, firestoreProfileId);
    await this.firebaseService.updateParticipantNameAndPhoneNumber(userName, phoneNumber, uid);
    this.alertService.presentAlert('Perfil atualizado com sucesso', 'Suas informações foram atualizas');
  }

  updateProfile(newUserName: string, newPhoneNumber: number, id: string) {
    return this.firestore.collection(this.PATH).doc(id).update({ userName: newUserName, phoneNumber: newPhoneNumber });
  }

  updateProfilePicture(newImageURL: string, id: string) {
    return this.firestore.collection(this.PATH).doc(id).update({ imageURL: newImageURL });
  }

  resetPassword(email: string) {
    this.auth.sendPasswordResetEmail(email);
  }

  logout() {
    this.auth.signOut();
    localStorage.setItem('user', 'null');
    this.routingService.goToLoginPage();
  }
}
