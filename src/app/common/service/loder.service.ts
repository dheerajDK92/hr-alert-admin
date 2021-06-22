import { Injectable } from "@angular/core";
import { LoadingController } from "@ionic/angular";
@Injectable({
  providedIn: "root",
})
export class LoaderService {
  constructor(private loadingController: LoadingController) {}
  async showLoader() {
    const loading = await this.loadingController.create({
      cssClass: "my-custom-class",
      message: "Please wait...",
      duration: 2000,
      backdropDismiss: false,
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log("Loading dismissed!");
  }

  // async dismissLoader() {
  //   this.loadingController.dismiss();
  // }
}
