import { Injectable } from "@angular/core";
import { ToastController } from "@ionic/angular";

@Injectable({
  providedIn: "root",
})
export class ToastService {
  constructor(public toastController: ToastController) {}
  // showtWarning(msg){
  //   this.loadToast(msg);
  // }
  async showWarning(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      buttons: [
       {
          text: 'X',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    toast.present();
  }

  async showError(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      color: 'danger',
      buttons: [
       {
          text: 'X',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    toast.present();
  }
}
