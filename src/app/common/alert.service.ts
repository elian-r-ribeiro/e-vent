import { Injectable } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private alertController: AlertController, private loadingController: LoadingController) { }

  async presentLoadingAlert(message: string){
    const loading = await this.loadingController.create({
      message: message,
      cssClass: 'loadingBox'
    });

    await loading.present();
    return loading;
  }

  async presentAlert(subHeader: string, message: string) {
    const alert = await this.alertController.create({
      cssClass: 'alertBox',
      header: 'E-vent',
      subHeader: subHeader,
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }

  async presentConfirmAlert(subHeader: string, message: string, onConfirm: () => void){
    const alert = await this.alertController.create({
      cssClass: 'confirmAlertBox',
      header: 'E-vent',
      subHeader: subHeader,
      message: message,
      buttons: [
        {text: "Cancelar", role: 'cancelar', handler: ()=>{}},
        {text: "Confirmar", role: 'confirmar', handler: ()=>{onConfirm()}}
      ],
    });
  
    await alert.present();
  }
}
