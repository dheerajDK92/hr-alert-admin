import { Component, OnInit, ViewChild } from "@angular/core";
import { NavParams } from "@ionic/angular";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthenticationService } from "../common/service/authentication.service";
import { environment } from "src/environments/environment";
import { ToastService } from "../common/service/toast.service";
import { isNullOrUndefined } from "util";
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  @ViewChild("loginForm", { static: false }) loginForm: NgForm;
  mobileForm: boolean = true;
  OTPForm: boolean = false;
  timer: any;
  resendOPTTime = environment.resendOTPTime;
  showResend = false;

  constructor(
    private router: Router,
    public navParams: NavParams,
    private _auth: AuthenticationService,
    private _toast: ToastService
  ) {}

  ngOnInit() {}
   submitForm(data) {
    // const validMobile = await new Promise((resolve, reject) => {
    //   setTimeout(() => {
    //     // TODO: need to call api to check mobile no. is registered or not
    //     try {
    //       resolve(true);
    //     } catch (e) {
    //       reject(false);
    //     }
    //   }, 3000);
    // });
    const filledData = data.form.value;
    this._auth.login(filledData).subscribe(
      (response: any) => {
        if (isNullOrUndefined(response.error)) {
          this._auth.setloginToken(response.data.token);
          this.redirectLogin();
        } else {
          this._toast.showWarning("Something Went Wrong. Please try again");
        }
      },
      (err) => {
        this._toast.showWarning(err.error.error);
      }
    );
  }

  private redirectLogin() {
    this.router.navigate(["/main/MainContent"]);
  }
}
