import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/common/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { RoutingService } from 'src/app/services/routing.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(private builder: FormBuilder, private authService: AuthService, private routingService: RoutingService, private alertService: AlertService) { }

  profileForm!: FormGroup;
  userInfo: any;

  ngOnInit() {
    this.profileForm = this.builder.group({
      userName: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      phoneNumber: ['', [Validators.required, this.validatePhoneNumber]],
    });
    if(this.authService.getLoggedUser() == null){
      this.routingService.goToLoginPage();
      this.alertService.presentAlert('Você tentou acessar uma página sem estar logado', 'Para acessar essa página você precisa estar logado, realize o login e tente novamente');
    };
    this.authService.getUserInfo().subscribe(res=>{
      this.userInfo = res.map(userInfo => {return{id:userInfo.payload.doc.id, ...userInfo.payload.doc.data() as any} as any});
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

  updateProfile(){
    if(!this.profileForm.valid){
      this.alertService.presentAlert('Erro ao atualizar perfil', 'Cheque os campos e tente novamente');
    }else{
      const firestoreProfileId = this.userInfo[0].id;
      this.authService.updateProfile(this.profileForm.value['userName'], this.profileForm.value['phoneNumber'], firestoreProfileId);
      this.alertService.presentAlert('Perfil atualizado com sucesso', 'Suas informações foram atualizas');
    }
  }

  logout(){
    this.authService.logout();
  }

}
