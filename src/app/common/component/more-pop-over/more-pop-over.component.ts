import { Component, OnInit } from "@angular/core";
import { PopoverController, NavParams } from "@ionic/angular";
import { AuthenticationService } from "../../service/authentication.service";
import { ToastService } from "../../service/toast.service";

@Component({
  selector: "app-more-pop-over",
  templateUrl: "./more-pop-over.component.html",
  styleUrls: ["./more-pop-over.component.scss"],
})
export class MorePopOverComponent implements OnInit {
  page;
  constructor(
    private navParams: NavParams,
    private popoverController: PopoverController,
    private authService: AuthenticationService,
    private _toast: ToastService
  ) {}

  ngOnInit() {
    this.page = this.navParams.get("data");
  }

  logout() {
    // code for logout
    this.popoverController.dismiss();
    this._toast.showWarning("Logout Successfully.");
    this.authService.logout();
    setTimeout(() => {
      location.reload();
    }, 500);
  }

  eventFromPopover() {
    this.popoverController.dismiss();
  }
}
