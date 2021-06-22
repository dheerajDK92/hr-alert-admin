import { Component, OnInit } from "@angular/core";
import { ModalController, AlertController } from "@ionic/angular";
import { EmployeeService } from "src/app/common/service/employee.service";
import { isNullOrUndefined } from "util";
import { ToastService } from "src/app/common/service/toast.service";
import { forkJoin } from "rxjs";
import { LoaderService } from "src/app/common/service/loder.service";
import { AddLogoComponent } from "../add-logo/add-logo.component";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-proof-status",
  templateUrl: "./proof-status.component.html",
  styleUrls: ["./proof-status.component.scss"],
})
export class ProofStatusComponent implements OnInit {
  constructor(
    private modalController: ModalController,
    private _emp: EmployeeService,
    private _toast: ToastService,
    private alertController: AlertController,
    private _loader: LoaderService
  ) {}
  empData;
  formData;
  ngOnInit() {
    this.formData = this.empData;
    const getBankDetail = this._emp.getBankDetails(this.formData._id);
    const getPANDetail = this._emp.getPANDetails(this.formData._id);
    const getPANImage = this._emp.getPANImageDetails(this.formData._id);
    const getADHAARImage = this._emp.getADHAARImageDetails(this.formData._id);
    const getAdhaarDetail = this._emp.getADHAARDetails(this.formData._id);
    const requestArray = [
      getBankDetail,
      getPANDetail,
      getAdhaarDetail,
      getPANImage,
      getADHAARImage,
    ];
    // this._loader.showLoader();
    forkJoin(requestArray).subscribe((results: any) => {
      const bankAccountDetails = results[0];
      const panDetails = results[1];
      const adhaarDetails = results[2];
      const panImageDetails = results[3];
      const adhaarImageDetails = results[4];
      this.setBankAccountDetailsData(bankAccountDetails);
      this.setPANData(panDetails);
      this.setPANImageData(panImageDetails);
      this.setADHAARImageData(adhaarImageDetails);
      this.setADHAARData(adhaarDetails);
    });
  }

  cancelPopUp() {
    this.modalController.dismiss();
  }
  panCardSegment = true;
  addressProffSection = false;
  bankDetailSection = false;
  segmentChanged(event) {
    const selectedSegment = event.detail.value;
    if (selectedSegment == "panCardSegment") {
      this.panCardSegment = true;
      this.addressProffSection = false;
      this.bankDetailSection = false;
    } else if (selectedSegment == "addressProffSection") {
      this.panCardSegment = false;
      this.addressProffSection = true;
      this.bankDetailSection = false;
    } else if (selectedSegment == "bankDetailSection") {
      this.panCardSegment = false;
      this.addressProffSection = false;
      this.bankDetailSection = true;
    }
  }

  submitPanCardForm(data) {
    console.log("data", data);
  }
  IFSCValidated = false;
  ifscValidatedData: any;

  clearISFC() {
    this.IFSCValidated = false;
    this.ifscValidatedData = null;
  }

  verifyIFSC(ifsc) {
    if (ifsc !== "" && ifsc !== null && ifsc !== undefined) {
      this._emp.validateIFSC(ifsc).subscribe(
        (response: any) => {
          if (isNullOrUndefined(response.error)) {
            if (response.data.result) {
              this.IFSCValidated = true;
              this.ifscValidatedData = response.data.result;
            }
          } else {
            this._toast.showWarning("Something Went Wrong. Please try again");
          }
        },
        (err) => {
          this._toast.showWarning(err.error.error);
        }
      );
    } else {
      this._toast.showWarning("Please enter valid IFSC code.");
    }
  }

  setBankAccountDetailsData(data): any {
    // this._loader.closeLoader();
    if (data.data.result.length > 0) {
      const value = data.data.result[0];
      this.AccountHolderName = value.name;
      this.bankAccountNumber = value.bankAccountNumber;
      this.IFSCValidated = true;
      this.ifscValidatedData = value;
    }
  }
  AccountHolderName: any = "";
  AccountHolderMobileNumber: any;
  bankAccountNumber: any = "";
  ifsc: any = "";
  saveBankAcccount() {
    const Data = {
      companyId: this.formData.companyId,
      employeeId: this.formData._id,
      name: this.AccountHolderName,
      bankAccountNumber: this.bankAccountNumber,
      IFSC: this.ifscValidatedData.IFSC,
      BRANCH: this.ifscValidatedData.BRANCH,
      BANK: this.ifscValidatedData.BANK,
      BANKCODE: this.ifscValidatedData.BANKCODE,
      CENTRE: this.ifscValidatedData.CENTRE,
      CITY: this.ifscValidatedData.CITY,
      DISTRICT: this.ifscValidatedData.DISTRICT,
      STATE: this.ifscValidatedData.STATE,
      ADDRESS: this.ifscValidatedData.ADDRESS,
      CONTACT: this.ifscValidatedData.CONTACT,
      UPI: this.ifscValidatedData.UPI,
      RTGS: this.ifscValidatedData.RTGS,
      NEFT: this.ifscValidatedData.NEFT,
      IMPS: this.ifscValidatedData.IMPS,
      MICR: this.ifscValidatedData.MICR,
      isVerified: false,
    };
    this._loader.showLoader();
    this._emp.saveBankDetails(Data).subscribe(
      (response: any) => {
        if (isNullOrUndefined(response.error)) {
          this._toast.showWarning(
            `Successfully Updated The Bank Details of '${this.formData.empname}'`
          );
        } else {
          this._toast.showWarning("Something Went Wrong. Please try again");
        }
      },
      (err) => {
        this._toast.showWarning(err.error.error);
      }
    );
  }

  PANEneterd: any;

  setPANData(data) {
    if (data.data.result.length > 0){
      this.PANEneterd = data.data.result[0].PAN;
    }
  }
  /**
   * pan image link
   */
  panImageURL = null;
  setPANImageData(data) {
    if (data.data.result.length > 0) {
      let hostUrl = environment.protocol + environment.imageApiURL;
      this.panImageURL = `${hostUrl}/images/PANImage/${data.data.result[0]._id}`;
    }
  }
  /**
   * adhaar image link
   */
  adhaarImageURL = null;
  setADHAARImageData(data) {
    if (data.data.result.length > 0) {
      let hostUrl = environment.protocol + environment.imageApiURL;
      this.adhaarImageURL = `${hostUrl}/images/ADHAARImage/${data.data.result[0]._id}`;
    }
  }

  PanSave() {
    const Data = {
      companyId: this.formData.companyId,
      employeeId: this.formData._id,
      PAN: this.PANEneterd,
      DOB: "",
      status: "",
    };
    this._loader.showLoader();
    this._emp.savePANDetails(Data).subscribe(
      (response: any) => {
        if (isNullOrUndefined(response.error)) {
          this._toast.showWarning(
            `Successfully Updated The PAN Details of '${this.formData.empname}'`
          );
        } else {
          this._toast.showWarning("Something Went Wrong. Please try again");
        }
      },
      (err) => {
        this._toast.showWarning(err.error.error);
      }
    );
  }
  /**
   * PanUpload
   */
  async PanUpload() {
    const modal = await this.modalController.create({
      component: AddLogoComponent,
      cssClass: "addLogoPage",
      componentProps: {
        empData: this.empData,
        uploadFor: "PAN",
      },
    });

    modal.onDidDismiss().then((data) => {
      this.ngOnInit();
    });

    return await modal.present();
  }

  async AdhaarUpload() {
    const modal = await this.modalController.create({
      component: AddLogoComponent,
      cssClass: "addLogoPage",
      componentProps: {
        empData: this.empData,
        uploadFor: "ADHAAR",
      },
    });
    modal.onDidDismiss().then((data) => {
      this.ngOnInit();
    });
    return await modal.present();
  }

  /**
   * AdhaarSave
   *
   */
  ADHAAREneterd: any;

  setADHAARData(data) {
    if(data.data.result.length > 0){
      this.ADHAAREneterd = data.data.result[0].ADHAAR;
    }
  }
  ADHAARSave() {
    const Data = {
      companyId: this.formData.companyId,
      employeeId: this.formData._id,
      ADHAAR: this.ADHAAREneterd,
      status: "",
    };
    this._loader.showLoader();
    this._emp.saveAdhaarDetails(Data).subscribe(
      (response: any) => {
        if (isNullOrUndefined(response.error)) {
          this._toast.showWarning(
            `Successfully Updated The PAN Details of '${this.formData.empname}'`
          );
        } else {
          this._toast.showWarning("Something Went Wrong. Please try again");
        }
      },
      (err) => {
        this._toast.showWarning(err.error.error);
      }
    );
  }
}
