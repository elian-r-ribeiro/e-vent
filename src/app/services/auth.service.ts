import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { RoutingService } from './routing.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  
  constructor(private auth: AngularFireAuth, private firestore: AngularFirestore, private routingService: RoutingService) { }

  private PATH : string = "users";

  async registerUser(userName: string, email: string, phoneNumber: number, password: string){
    await this.auth.createUserWithEmailAndPassword(email, password);
    await this.firestore.collection(this.PATH).add({userName, email, phoneNumber});
    this.routingService.goToHomePage();
  }

  userLogin(email: string, password: string){
    this.auth.signInWithEmailAndPassword(email, password);
  }
}
