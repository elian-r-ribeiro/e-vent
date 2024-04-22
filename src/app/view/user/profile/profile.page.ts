import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/common/alert.service';
import { AuthService } from 'src/app/model/services/auth.service';
import { FirebaseService } from 'src/app/model/services/firebase.service';
import { RoutingService } from 'src/app/model/services/routing.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(private firebaseService: FirebaseService, private builder: FormBuilder, private authService: AuthService, private routingService: RoutingService, private alertService: AlertService) { }

  profileForm!: FormGroup;
  userInfo: any;
  image: any = null;

  ngOnInit() {
    this.profileForm = this.builder.group({
      userName: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      phoneNumber: ['', [Validators.required, this.validatePhoneNumber]],
      profileImage: [null]
    });
    if (this.authService.getLoggedUser() == null) {
      this.routingService.goToLoginPage();
      this.alertService.presentAlert('Você tentou acessar uma página sem estar logado', 'Para acessar essa página você precisa estar logado, realize o login e tente novamente');
    };
    this.authService.getUserInfo().subscribe(res => {
      this.userInfo = res.map(userInfo => { return { id: userInfo.payload.doc.id, ...userInfo.payload.doc.data() as any } as any });
      if (this.userInfo.length > 0) {
        this.profileForm.get('userName')?.setValue(this.userInfo[0].userName);
        this.profileForm.get('phoneNumber')?.setValue(this.userInfo[0].phoneNumber);
      };
    });
  }

  validatePhoneNumber(control: FormControl): { [s: string]: boolean } | null {
    if (control.value && control.value.toString().trim().length !== 11) {
      return { 'validatePhoneNumber': true };
    }
    return null;
  }

  uploadFile(image: any) {
    this.image = image.files;
  }

  updateProfile() {
    if (!this.profileForm.valid) {
      this.alertService.presentAlert('Erro ao atualizar perfil', 'Cheque os campos e tente novamente');
    } else {
      const firestoreProfileId = this.userInfo[0].id;
      if (this.image != null) {
        const file = this.image.item(0);
        if (file.type.split('/')[0] !== 'image') {
          this.alertService.presentAlert('Erro ao enviar foto de perfil', 'Tipo não suportado');
        } else {
          const uid = this.authService.getLoggedUser().uid;
          const uploadTask = this.firebaseService.uploadImage(this.image, 'profilePictures', uid);
          uploadTask?.then(async snapshot => {
            const imageURL = await snapshot.ref.getDownloadURL();
            this.authService.updateProfilePicture(imageURL, firestoreProfileId);
          })
          this.authService.updateProfile(this.profileForm.value['userName'], this.profileForm.value['phoneNumber'], firestoreProfileId);
          this.alertService.presentAlert('Perfil atualizado com sucesso', 'Suas informações foram atualizas');
        }
      } else{
        this.authService.updateProfile(this.profileForm.value['userName'], this.profileForm.value['phoneNumber'], firestoreProfileId);
        this.alertService.presentAlert('Perfil atualizado com sucesso', 'Suas informações foram atualizas');
      }

      
    }
  }

  logout() {
    this.authService.logout();
  }

}
