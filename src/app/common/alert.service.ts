import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private alertController: AlertController) { }

  async presentAlert(subHeader: string, message: string) {
    const alert = await this.alertController.create({
      header: 'E-vent',
      subHeader: subHeader,
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }

  async presentConfirmAlert(subHeader: string, message: string, onConfirm: () => void){
    const alert = await this.alertController.create({
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
