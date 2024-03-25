import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { RoutingService } from './routing.service';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  
  constructor(private firebaseService: FirebaseService, private auth: AngularFireAuth, private firestore: AngularFirestore, private routingService: RoutingService) { }

  private PATH : string = "users";

  async registerUser(userName: string, email: string, phoneNumber: number, password: string, image: any){
    const uploadTask = this.firebaseService.uploadImage(image);

    uploadTask?.then(async snapshot => {
      const imageURL = await snapshot.ref.getDownloadURL();
      const userData = await this.auth.createUserWithEmailAndPassword(email, password);
      const userID = userData.user?.uid;
      await this.firestore.collection(this.PATH).add({userName, email, phoneNumber, imageURL, userID});
      this.routingService.goToLoginPage();
    })
  }

  userLogin(email: string, password: string){
    this.auth.signInWithEmailAndPassword(email, password);
  }
}
