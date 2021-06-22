import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { FileUploader } from "ng2-file-upload";
import { ApiUrlService } from "src/app/common/service/api-url.service";
import { environment } from "src/environments/environment";
import { AuthenticationService } from "src/app/common/service/authentication.service";
import { ToastService } from "src/app/common/service/toast.service";

@Component({
  selector: "app-add-logo",
  templateUrl: "./add-logo.component.html",
  styleUrls: ["./add-logo.component.scss"],
})
export class AddLogoComponent implements OnInit {
  empData: any;
  uploadFor: any;
  apiURL: any;
  title: String = "";
  public uploader: FileUploader = new FileUploader({
    url: "",
    // allowedFileType: ["jp", "xlsx", "csv"],
  });

  constructor(
    private modalController: ModalController,
    private _apiURL: ApiUrlService,
    private authService: AuthenticationService,
    private _toast: ToastService
  ) {}

  ngOnInit() {
    if (this.uploadFor == "Company") {
      this.apiURL = this._apiURL.getUrl("uploadCompanyLogo");
      this.title = "Change Company Logo";
      this.uploader.onAfterAddingFile = (file) => {
        console.log("file", file);
        file.withCredentials = false;
      };
      this.uploader.onBeforeUploadItem = (item) => {
        item.withCredentials = false;
        item.url = this.apiURL;
      };
    } else if (this.uploadFor == "Employee") {
      this.apiURL = this._apiURL.getUrl("uploadEmployeePic");
      this.title = "Change Employee Profile";
    } else if (this.uploadFor == "PAN") {
      this.apiURL = this._apiURL.getUrl("uploadPAN");
      this.title = "Upload PAN Card";
    } else if (this.uploadFor == "ADHAAR") {
      this.apiURL = this._apiURL.getUrl("uploadADHAAR");
      this.title = "Upload ADHAAR Card";
    }
    // common method for Employee Profile Pic upload
    this.uploader.onCompleteItem = (
      item: any,
      response: any,
      status: any,
      headers: any
    ) => {
      //
    };

    this.uploader.onCompleteItem = (
      item: any,
      response: any,
      status: any,
      headers: any
    ) => {
      if (status == 400) {
        this._toast.showWarning("Something went wrong, Please try again.");
      } else {
        this._toast.showWarning("Successfully uploaded.");
        this.modalController.dismiss({ uploaded: true });
      }
    };
  }

  onFileChange(event) {
    this.uploader.onBeforeUploadItem = (item) => {
      item.withCredentials = false;
      item.url = this.apiURL;
      if (this.uploadFor == "Company") {
        item.headers = [
          { name: environment.TOKEN_KEY, value: this.authService.token },
          { name: "company-token", value: this.empData._id },
        ];
      } else {
        item.headers = [
          { name: environment.TOKEN_KEY, value: this.authService.token },
          { name: "company-id", value: this.empData.companyId },
          { name: "employee-id", value: this.empData._id },
        ];
      }
    };

    this.uploader.uploadAll();
  }

  cancelPopUp() {
    this.modalController.dismiss();
  }
}
