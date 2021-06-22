import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiUrlService } from "../common/service/api-url.service";
import { EmployeeService } from "../common/service/employee.service";
import { ToastService } from "../common/service/toast.service";
import { isNullOrUndefined } from "util";
import { Subscription } from "rxjs";
import { AlertController } from "@ionic/angular";
import { LoaderService } from '../common/service/loder.service';

@Component({
  selector: "app-feedback",
  templateUrl: "./feedback.page.html",
  styleUrls: ["./feedback.page.scss"],
})
export class feedbackPage implements OnInit {
  public main: string;
  private isFeedbackLoad: Subscription;
  feedbackData: any;
  // filterFeedbackData: any;
  skelenton = true;
  constructor(
    private activatedRoute: ActivatedRoute,
    private _emp: EmployeeService,
    private _toast: ToastService,
    private alertCtrl: AlertController,
    private _loader: LoaderService
  ) {}

  ngOnInit() {
    this._loader.showLoader();
    this.main = this.activatedRoute.snapshot.paramMap.get("id");
    this.LoadFeedBack(null);
  }

  LoadFeedBack(event) {
    this._emp.getAllFeedback().subscribe(
      (response: any) => {
        console.log("response", response);
        this.skelenton = false;
        if (event) event.target.complete();
        if (isNullOrUndefined(response.error)) {
          this.feedbackData = response.data.feedback;
          // this.filterFeedbackData = response.data.feedback;
          // this.feedbackData = this.filterFeedbackData
        } else {
          this._toast.showWarning("Something Went Wrong. Please try again");
        }
      },
      (err) => {
        this.skelenton = false;
        if (event) event.target.complete();
        this._toast.showWarning(err.error.error);
      }
    );
  }

  async reply(data) {
    console.log("data", data);
    const alert = await this.alertCtrl.create({
      header: `Reply To ${data.employeeId} - ${data.email}`,
      // message: "Enter Message...",
      cssClass: "feedback-admin",
      inputs: [
        {
          type: "textarea",
          name: "Reply",
          placeholder: "Reply...",
        },
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          handler: (data) => {
            console.log("Cancel clicked");
          },
        },
        {
          text: "Reply",
          handler: (res) => {
            if (
              res.Reply === "" ||
              res.Reply === null ||
              res.Reply === undefined
            ) {
              this._toast.showWarning("Reply is mandatory.");
              return false;
            }else{
            const detail = {
              message: res.Reply,
              email: data.email,
            };
            this._emp.sendMail(detail).subscribe(
              (response: any) => {
                console.log("response", response);
                this.skelenton = false;
                if (isNullOrUndefined(response.error)) {
                  if (response.data.message == "success") {
                    this._toast.showWarning(
                      `Email Sent Successfully to ${data.email}`
                    );
                  }
                } else {
                  this._toast.showWarning(
                    "Something Went Wrong. Please try again"
                  );
                }
              },
              (err) => {
                this.skelenton = false;
                this._toast.showWarning(err.error.error);
              }
            );
            console.log("data", data);
            }
          },
        },
      ],
    });
    await alert.present();
  }
}
