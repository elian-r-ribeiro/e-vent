import { Injectable, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { RoutingService } from './routing.service';
import { FirebaseService } from './firebase.service';
import { Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit {

  userData: any;

  constructor(private firebaseService: FirebaseService, private auth: AngularFireAuth, private firestore: AngularFirestore, private routingService: RoutingService) {
    this.auth.authState.subscribe(user =>{
      if(user){
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
      }else{
        localStorage.setItem('user', 'null');
      }
    });
  }

  ngOnInit() {

  }

  private PATH: string = "users";

  async registerUser(userName: string, email: string, phoneNumber: number, password: string, image: any) {
    const uploadTask = this.firebaseService.uploadImage(image);

    uploadTask?.then(async snapshot => {
      const imageURL = await snapshot.ref.getDownloadURL();
      const userData = await this.auth.createUserWithEmailAndPassword(email, password);
      const uid = userData.user?.uid;
      await this.firestore.collection(this.PATH).add({ userName, email, phoneNumber, imageURL, uid });
      this.routingService.goToLoginPage();
    })
  }

  userLogin(email: string, password: string) {
    this.auth.signInWithEmailAndPassword(email, password);
  }

  getLoggedUser(){
    const user : any = JSON.parse(localStorage.getItem('user') || 'null');
    return (user !== null) ? user : null;
  }
}
