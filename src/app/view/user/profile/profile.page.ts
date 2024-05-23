import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/common/alert.service';
import { OthersService } from 'src/app/common/others.service';
import { AuthService } from 'src/app/model/services/auth.service';
import { FirebaseService } from 'src/app/model/services/firebase.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {

  

  constructor(private othersService: OthersService, private firebaseService: FirebaseService, private builder: FormBuilder, private authService: AuthService, private alertService: AlertService) { }

  profileForm!: FormGroup;
  userInfo: any;
  image: any = null;
  private subscriptions : Subscription[] = [];
  isFileSelected = false;
  fileSelectLabelText = "Selecionar foto de perfil";
  loggedUserUID = this.authService.getLoggedUserThroughLocalStorage().uid;

  ngOnInit(): void {
    this.othersService.checkAppMode();
    this.startForm();
    this.authService.checkIfUserIsntLogged();
    this.setUserInfo();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      if(subscription){
        subscription.unsubscribe();
      }
    })
  }

  setUserInfo(): void {
    const getUserInfoSubscription = this.firebaseService.getSomethingFromFirebaseWithConditionAlreadySubscribed('uid', this.loggedUserUID, 'users').subscribe(res => {
      this.userInfo = res;
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

  uploadFile(image: any): void {
    this.image = image.files;
  }

  showConfirmProfileEdit(): void {
    if (!this.profileForm.valid) {
      this.alertService.presentAlert('Erro ao atualizar perfil', 'Cheque os campos e tente novamente');
    } else {
      this.alertService.presentConfirmAlert('Atenção', 'Tem certeza que deseja editar seu perfil? Essa ação não pode ser desfeita', this.updateProfile.bind(this));
    }
  }

  showConfirmLogout(): void {
    this.alertService.presentConfirmAlert('Atenção', 'Tem certeza que deseja sair dessa conta?', this.logout.bind(this));
  }

  async updateProfile(): Promise<void> {
    const loading = await this.alertService.presentLoadingAlert("Atualizando perfil...");

    const firestoreProfileId = this.userInfo[0].id;
    if (this.image != null) {
      if (!this.othersService.checkIfFileTypeIsCorrect(this.image)) {
        loading.dismiss();
      } else {
        const imageURL = await this.firebaseService.getImageDownloadURL(this.image, this.loggedUserUID);
        await this.authService.updateProfileWithNoProfilePicture(this.profileForm.value['userName'], this.profileForm.value['phoneNumber'], firestoreProfileId, this.loggedUserUID);
        await this.authService.updateProfilePicture(imageURL, firestoreProfileId);
        loading.dismiss();
      }
    } else {
      await this.authService.updateProfileWithNoProfilePicture(this.profileForm.value['userName'], this.profileForm.value['phoneNumber'], firestoreProfileId, this.loggedUserUID);
      loading.dismiss();
    }

  }

  logout(): void {
    this.authService.logout();
  }

  changeFileInputLabelOnFileSelect(value: string): void {
    this.isFileSelected = this.othersService.changeFileInputStateOnFileSelect(value);
    this.fileSelectLabelText = this.othersService.changeFileInputLabelOnFileSelect(value, "Foto de perfil selecionada", "Selecione a foto de perfil");
  }

  startForm(): void {
    this.profileForm = this.builder.group({
      userName: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      phoneNumber: ['', [Validators.required, this.validatePhoneNumber]],
      profileImage: [null]
    });
  }
}
