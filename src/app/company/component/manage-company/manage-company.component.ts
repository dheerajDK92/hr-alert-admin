import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  OnChanges,
} from "@angular/core";
import { CompanyService } from "src/app/common/service/company.service";
import { ToastService } from "src/app/common/service/toast.service";
import { AlertController } from "@ionic/angular";
import { isNullOrUndefined } from "util";

@Component({
  selector: "app-manage-company",
  templateUrl: "./manage-company.component.html",
  styleUrls: ["./manage-company.component.scss"],
})
export class ManageCompanyComponent implements OnInit, OnChanges {
  constructor(
    private _com: CompanyService,
    private _toast: ToastService,
    private alertController: AlertController
  ) {}
  @Output() public successFullyRegister = new EventEmitter();
  @Input("companyDetails") companyDetails: any;
  companyProfileView = true;
  employeeListView = false;
  addEmployeeView = false;
  // this.successFullyRegister.emit("true"); // TODO: we can add this while revert back to Companies page
  ngOnInit() {
    console.log("companyDetails ===>", this.companyDetails);
  }

  ngOnChanges(changes: any) {
    if (changes.companyDetails) {
      this.companyDetails = changes.companyDetails.currentValue;
    }
  }

  backToMain() {
    this.successFullyRegister.emit("true");
  }

  segmentChanged(event) {
    const selectedSegment = event.detail.value;
    if (selectedSegment == "companyProfile") {
      this.companyProfileView = true;
      this.employeeListView = false;
      this.addEmployeeView = false;
    } else if (selectedSegment == "employee") {
      this.companyProfileView = false;
      this.employeeListView = true;
      this.addEmployeeView = false;
    } else if (selectedSegment == "AddEmployee") {
      this.companyProfileView = false;
      this.employeeListView = false;
      this.addEmployeeView = true;
    }
  }

  async deleteCompany() {
    const confirmAlert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Do you want to proceed?",
      message:
        "By clicking on confirm, Your added company and employee related to company will permanently delete. If you want to proceed please click on Confirm.",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondaryButton",
          handler: (blah) => {
            console.log("Confirm Cancel: blah");
          },
        },
        {
          text: "Confirm",
          cssClass: "primaryButton",
          handler: () => {
            this._com.deleteCompany(this.companyDetails).subscribe(
              (response: any) => {
                if (isNullOrUndefined(response.error)) {
                  this.successFullyRegister.emit("true");
                  this._toast.showWarning(
                    `Successfully '${this.companyDetails.companyName}' Company and Employee Deleted`
                  );
                } else {
                  this._toast.showWarning(
                    "Something Went Wrong. Please try again"
                  );
                }
              },
              (err) => {
                this._toast.showWarning(err.error.error);
              }
            );
          },
        },
      ],
      // backdropDismiss: false,
    });

    await confirmAlert.present();
  }

  activateView(event) {
    if(event =="employeeListView"){
      this.employeeListView = true;
      this.addEmployeeView = false;
      this.companyProfileView = false;
    }else if(event =="addEmployeeView"){
      this.employeeListView = false;
      this.addEmployeeView = true;
      this.companyProfileView = false;
    }else if(event =="companyProfileView"){
      this.employeeListView = false;
      this.addEmployeeView = false;
      this.companyProfileView = true;
    }    
  }
}
