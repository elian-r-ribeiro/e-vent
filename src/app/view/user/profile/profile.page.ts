import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/common/alert.service';
import { OthersService } from 'src/app/common/others.service';
import { AuthService } from 'src/app/model/services/auth.service';
import { FirebaseService } from 'src/app/model/services/firebase.service';
import { RoutingService } from 'src/app/model/services/routing.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {

  

  constructor(private othersService: OthersService, private loadingController: LoadingController,private firebaseService: FirebaseService, private builder: FormBuilder, private authService: AuthService, private routingService: RoutingService, private alertService: AlertService) { }

  profileForm!: FormGroup;
  userInfo: any;
  image: any = null;
  private subscriptions : Subscription[] = [];
  isFileSelected = false;
  fileSelectLabelText = "Selecionar foto de perfil";

  ngOnInit() {
    this.othersService.checkAppMode();
    this.startForm();
    this.authService.checkIfUserIsntLoged();
    this.setUserInfo();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      if(subscription){
        subscription.unsubscribe();
      }
    })
  }

  setUserInfo(){
    const getUserInfoSubscription = this.authService.getUserInfoFromFirebase().subscribe(res => {
      this.userInfo = res.map(userInfo => { return { id: userInfo.payload.doc.id, ...userInfo.payload.doc.data() as any } as any });
      if (this.userInfo.length > 0) {
        this.profileForm.get('userName')?.setValue(this.userInfo[0].userName);
        this.profileForm.get('phoneNumber')?.setValue(this.userInfo[0].phoneNumber);
      };
    });
    this.subscriptions.push(getUserInfoSubscription);
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

  showConfirmProfileEdit() {
    if (!this.profileForm.valid) {
      this.alertService.presentAlert('Erro ao atualizar perfil', 'Cheque os campos e tente novamente');
    } else {
      this.alertService.presentConfirmAlert('Atenção', 'Tem certeza que deseja editar seu perfil? Essa ação não pode ser desfeita', this.updateProfile.bind(this));
    }
  }

  showConfirmLogout(){
    this.alertService.presentConfirmAlert('Atenção', 'Tem certeza que deseja sair dessa conta?', this.logout.bind(this));
  }

  async updateProfile() {
    const loading = await this.alertService.presentLoadingAlert("Atualizando perfil...");

    const firestoreProfileId = this.userInfo[0].id;
    const uid = this.authService.getLoggedUserThroughLocalStorage().uid;
    if (this.image != null) {
      if (!this.othersService.checkIfFileTypeIsCorrect(this.image)) {
        loading.dismiss();
      } else {
        const imageURL = await this.firebaseService.getImageDownloadURL(this.image, uid);
        await this.authService.updateProfileWithNoProfilePicture(this.profileForm.value['userName'], this.profileForm.value['phoneNumber'], firestoreProfileId, uid);
        await this.authService.updateProfilePicture(imageURL, firestoreProfileId);
        loading.dismiss();
      }
    } else {
      await this.authService.updateProfileWithNoProfilePicture(this.profileForm.value['userName'], this.profileForm.value['phoneNumber'], firestoreProfileId, uid);
      loading.dismiss();
    }

  }

  logout() {
    this.authService.logout();
  }

  changeFileInputLabelOnFileSelect(value: string){
    this.isFileSelected = this.othersService.changeFileInputStateOnFileSelect(value);
    this.fileSelectLabelText = this.othersService.changeFileInputLabelOnFileSelect(value, "Foto de perfil selecionada", "Selecione a foto de perfil");
  }

  startForm(){
    this.profileForm = this.builder.group({
      userName: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      phoneNumber: ['', [Validators.required, this.validatePhoneNumber]],
      profileImage: [null]
    });
  }
}
