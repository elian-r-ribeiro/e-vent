import { Injectable, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { RoutingService } from './routing.service';
import { FirebaseService } from './firebase.service';
import { AlertService } from '../common/alert.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit {

  userData: any;
  userInfo: any;

  constructor(private firebaseService: FirebaseService, private alertService: AlertService, private auth: AngularFireAuth, private firestore: AngularFirestore, private routingService: RoutingService) {
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
    const file = image.item(0);
    if (file.type.split('/')[0] !== 'image') {
      this.alertService.presentAlert('Erro ao enviar foto de perfil', 'Tipo não suportado');
    } else {
      const userData = await this.auth.createUserWithEmailAndPassword(email, password).then(async (userData) => {
        const uid = userData.user?.uid;
        const uploadTask = this.firebaseService.uploadImage(image, 'profilePictures', uid);
        uploadTask?.then(async snapshot => {
          const imageURL = await snapshot.ref.getDownloadURL();
          
          await this.firestore.collection(this.PATH).add({ userName, email, phoneNumber, imageURL, uid });
          await this.alertService.presentAlert('Registro realizado com sucesso', 'Você será redirecionado para a página de login');
          this.routingService.goToLoginPage();
        })
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

  getLoggedUser() {
    const user: any = JSON.parse(localStorage.getItem('user') || 'null');
    return (user !== null) ? user : null;
  }

  getUserInfo() {
    const loggedUserUID = this.getLoggedUser().uid;
    return this.firestore.collection(this.PATH, ref => ref.where('uid', '==', loggedUserUID)).snapshotChanges();
  }

  updateProfile(newUserName: string, newPhoneNumber: number, id: string) {
    return this.firestore.collection(this.PATH).doc(id).update({ userName: newUserName, phoneNumber: newPhoneNumber });
  }

  updateProfilePicture(newImageURL: string, id: string) {
    return this.firestore.collection(this.PATH).doc(id).update({ imageURL: newImageURL});
  }

  logout() {
    this.auth.signOut();
    localStorage.setItem('user', 'null');
    this.routingService.goToLoginPage();
  }
}
