import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  OnChanges,
  OnDestroy,
} from "@angular/core";
import { EmployeeService } from "src/app/common/service/employee.service";
import { isNullOrUndefined } from "util";
import { ToastService } from "src/app/common/service/toast.service";
import { AlertController, ModalController, Platform } from "@ionic/angular";
import { Subscription } from "rxjs";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { File } from "@ionic-native/file/ngx";
import { FileOpener } from "@ionic-native/file-opener/ngx";
import { ApiUrlService } from "src/app/common/service/api-url.service";
import { LoaderService } from "src/app/common/service/loder.service";
import { ExportToCsv } from "export-to-csv";
import { GLOBAL } from "../../commonDeclare";

@Component({
  selector: "app-employee-report",
  templateUrl: "./employee-report.component.html",
  styleUrls: ["./employee-report.component.scss"],
})
export class EmployeeReportComponent implements OnInit, OnDestroy, OnChanges {
  public main: string;
  EmpData: any = null;
  CmpData: any = null;
  @Output() public successFullyRegister = new EventEmitter();
  @Input("companyDetails") companyDetails: any;

  isEmployeeLoading: Subscription;
  constructor(
    private _api: ApiUrlService,
    private plt: Platform,
    private _emp: EmployeeService,
    private _toast: ToastService,
    private file: File,
    private fileOpener: FileOpener,
    private alertController: AlertController,
    private _util: LoaderService
  ) {}

  backToMain() {
    this.successFullyRegister.emit("true");
  }

  ngOnChanges(changes: any) {
    console.log("changes ===>", changes);
    if (changes.companyDetails) {
      this.companyDetails = changes.companyDetails.currentValue;
    }
  }

  ngOnInit() {
    this.loadCompanyEmp();
  }
  /**
   *
   */
  viewType = "reports";
  segmentChanged(event) {
    const selectedSegment = event.detail.value;
    if (selectedSegment == "reports") {
      this.viewType = "reports";
    } else if (selectedSegment == "salaryReports") {
      this.viewType = "salaryReports";
    }
  }
  /**
   * load company employee details
   */
  employees: any[] = [];
  selectedEmployee: any;
  loadCompanyEmp() {
    if (this.isEmployeeLoading) {
      this.isEmployeeLoading.unsubscribe();
    }
    this.isEmployeeLoading = this._emp
      .getCompanyEmployeeDetail(this.companyDetails._id)
      .subscribe(
        (response: any) => {
          if (isNullOrUndefined(response.error)) {
            console.log("response ===>", response.data.employeeList);
            this.employees = response.data.employeeList;
          } else {
            this._toast.showWarning(
              "Something Went Wrong While Loading Employee. Please try again"
            );
          }
        },
        (err) => {
          this._toast.showWarning(err.error.error);
        }
      );
  }
  /**
   * Search
   */
  reportType: any;
  selectedScreen: any;
  search() {
    console.log("event", this.reportType);
    console.log("selectedEmployee", this.selectedEmployee);
    this.EmpData = this.selectedEmployee;
    if (this.reportType == "Leave Summary") {
      this.selectedScreen = "Leave";
      this._util.showLoader();
      this.loadApplyLeave();
    } else if (this.reportType == "Advance Summary") {
      this.selectedScreen = "Advance";
      this._util.showLoader();
      this.loadAdvance();
    } else if (this.reportType == "Reimbursement Summary") {
      this.selectedScreen = "Reimbursement";
      this._util.showLoader();
      this.loadReimbursement();
    } else if (this.reportType == "Attendance Summary") {
      this.selectedScreen = "Attendance";
      this._util.showLoader();
      this.loadAttendance();
    } else {
      this._toast.showWarning("Please Select Report Type To Proceed.");
    }
  }

  /**
   * loadApplyLeave : Load the Leave details - start
   */
  private isLeaveLoad: Subscription;
  leaveByEmploy: any;
  leaveFilterList: any;
  loadApplyLeave() {
    if (this.isLeaveLoad) {
      this.isLeaveLoad.unsubscribe();
    }
    this.isLeaveLoad = this._emp.getRequestLeave(this.EmpData._id).subscribe(
      (response: any) => {
        if (isNullOrUndefined(response.error)) {
          this.leaveByEmploy = response.data.details;
          this.leaveFilterList = response.data.details;
          this.createLeavePdf();
        } else {
          this._toast.showWarning("Something Went Wrong. Please try again");
        }
      },
      (err) => {
        this._toast.showWarning(err.error.error);
      }
    );
  }

  pdfObj = null;
  createLeavePdf() {
    /**
     * creating the pdf data - start
     */
    let values = [
      [
        { text: "Email", bold: true },
        { text: "Leave Reason", bold: true },
        { text: "Start Date", bold: true },
        { text: "End Date", bold: true },
        { text: "HR Remarks", bold: true },
        { text: "Status", bold: true },
      ],
    ];
    for (let itm of this.leaveFilterList) {
      const startDate = new Date(itm.startDate);
      const endDate = new Date(itm.endDate);
      values.push([
        itm.email,
        itm.reason,
        `${startDate.getDate()}:${startDate.getMonth()}:${startDate.getFullYear()}`,
        `${endDate.getDate()}:${endDate.getMonth()}:${endDate.getFullYear()}`,
        itm.hrRemarks,
        itm.status,
      ]);
    }

    const finalValuestoPrint = values;
    /* End here */
    var docDefinition = {
      watermark: {
        text: `${this.CmpData.companyName}`,
        color: "blue",
        opacity: 0.2,
        bold: true,
        italics: false,
      },
      content: [
        {
          text: `Leave Detail's`,
          style: "header",
          color: "blue",
          bold: true,
        },
        { text: `Total ${this.leaveFilterList?.length}`, alignment: "right" },
        { text: new Date().toTimeString(), alignment: "right" },
        { text: ``, alignment: "center" },
        {
          style: "tableExample",
          table: {
            body: finalValuestoPrint,
          },
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 15, 0, 0],
        },
        story: {
          italic: true,
          alignment: "center",
          width: "50%",
        },
      },
    };
    this.pdfObj = pdfMake.createPdf(docDefinition);
  }

  downloadPdf() {
    if (this.plt.is("cordova")) {
      this.pdfObj.getBuffer((buffer) => {
        var blob = new Blob([buffer], { type: "application/pdf" });

        // Save the PDF to the data Directory of our App
        this.file
          .writeFile(this.file.dataDirectory, "reimbursements.pdf", blob, {
            replace: true,
          })
          .then((fileEntry) => {
            // Open the PDf with the correct OS tools
            this.fileOpener.open(
              this.file.dataDirectory + "reimbursements.pdf",
              "application/pdf"
            );
          });
      });
    } else {
      // On a browser simply use download!
      this.pdfObj.download();
    }
  }

  /**
   *
   * @param event after change search value event will have ref of updated value
   */
  leaveSearchBarChange(event: any) {
    const searchValue = event.detail.value;
    if (searchValue == "" || searchValue == null || searchValue == undefined) {
      this.leaveByEmploy = this.leaveFilterList;
    } else {
      this.leaveByEmploy = this.leaveFilterList.filter((itm) =>
        String(itm.email)
          .toLowerCase()
          .startsWith(String(searchValue).toLowerCase())
      );
    }
  }

  async performRejectActionLeave(selectedItem) {
    console.log("selectedItem ==>", selectedItem);
    const confirmAlert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Do you want to proceed?",
      message: `By clicking on confirm, 
      Leave request by <strong>${selectedItem.email}</strong> will <strong>Reject</strong>. If you want to proceed please click on Confirm.`,
      inputs: [
        {
          type: "textarea",
          name: "Remarks",
          placeholder: "Remarks...",
        },
      ],
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
          handler: (res) => {
            console.log("res", res);
            if (
              res.Remarks === "" ||
              res.Remarks === null ||
              res.Remarks === undefined
            ) {
              this._toast.showWarning("Remarks are mandatory");
              return false;
            } else {
              const finalData: any = {
                startDate: selectedItem.startDate,
                endDate: selectedItem.endDate,
                allDay: selectedItem.allDay,
                reason: selectedItem.reason,
                companyId: selectedItem.companyId,
                employeeId: selectedItem.employeeId,
                email: selectedItem.email,
                phone: selectedItem.phone,
                status: "Rejected",
                hrRemarks: res.Remarks,
                _id: selectedItem._id,
              };
              this._emp.updateLeaveStatus(finalData).subscribe(
                (response: any) => {
                  if (isNullOrUndefined(response.error)) {
                    this.loadApplyLeave();
                    this._toast.showWarning(
                      `${selectedItem.email}'s Leave Request Is Rejected.`
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
            }
          },
        },
      ],
      // backdropDismiss: false,
    });

    await confirmAlert.present();
  }

  async performApproveActionLeave(selectedItem) {
    console.log("selectedItem ==>", selectedItem);
    const confirmAlert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Do you want to proceed?",
      message: `By clicking on confirm, 
      Leave request by <strong>${selectedItem.email}</strong> will <strong>Approve</strong>. If you want to proceed please click on Confirm.`,
      inputs: [
        {
          type: "textarea",
          name: "Remarks",
          placeholder: "Remarks...",
        },
      ],
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
          handler: (res) => {
            console.log("res", res);
            if (
              res.Remarks === "" ||
              res.Remarks === null ||
              res.Remarks === undefined
            ) {
              this._toast.showWarning("Remarks are mandatory");
              return false;
            } else {
              const finalData: any = {
                startDate: selectedItem.startDate,
                endDate: selectedItem.endDate,
                allDay: selectedItem.allDay,
                reason: selectedItem.reason,
                companyId: selectedItem.companyId,
                employeeId: selectedItem.employeeId,
                email: selectedItem.email,
                phone: selectedItem.phone,
                status: "Approved",
                hrRemarks: res.Remarks,
                _id: selectedItem._id,
              };
              this._emp.updateLeaveStatus(finalData).subscribe(
                (response: any) => {
                  if (isNullOrUndefined(response.error)) {
                    this.loadApplyLeave();
                    this._toast.showWarning(
                      `${selectedItem.email}'s Leave Request Is Approved.`
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
            }
          },
        },
      ],
      // backdropDismiss: false,
    });

    await confirmAlert.present();
  }

  /**
   * end leave
   */

  /**
   * Reimbursement Start
   */
  isReimburseLoad: Subscription;
  reimbursementByEmploy: any;
  reimbursementFilterList: any;
  loadReimbursement() {
    if (this.isReimburseLoad) {
      this.isReimburseLoad.unsubscribe();
    }
    this.isReimburseLoad = this._emp
      .getRequestReimbursement(this.EmpData._id)
      .subscribe(
        (response: any) => {
          if (isNullOrUndefined(response.error)) {
            this.reimbursementByEmploy = response.data.reimbursementDetails;
            this.reimbursementFilterList = response.data.reimbursementDetails;
            // this.countTotal(response.data.reimbursementDetails);
            this.createReimbursementPdf();
          } else {
            this._toast.showWarning("Something Went Wrong. Please try again");
          }
        },
        (err) => {
          this._toast.showWarning(err.error.error);
        }
      );
  }

  createReimbursementPdf() {
    /**
     * creating the pdf data - start
     */
    let values = [
      [
        { text: "Type", bold: true },
        { text: "Amount", bold: true },
        { text: "Date", bold: true },
        { text: "Email", bold: true },
        { text: "Status", bold: true },
      ],
    ];
    for (let itm of this.reimbursementFilterList) {
      const dateEntered = new Date(itm.date);
      values.push([
        itm.reimbursementType,
        itm.amount,
        `${dateEntered.getDate()}:${dateEntered.getMonth()}:${dateEntered.getFullYear()}`,
        itm.email,
        itm.status,
      ]);
    }

    const finalValuestoPrint = values;
    /* End here */
    var docDefinition = {
      watermark: {
        text: `${this.CmpData.companyName}`,
        color: "blue",
        opacity: 0.2,
        bold: true,
        italics: false,
      },
      content: [
        {
          text: `Reimbursement Detail's`,
          style: "header",
          color: "blue",
          bold: true,
        },
        {
          text: `Total ${this.reimbursementFilterList?.length}`,
          alignment: "right",
        },
        { text: new Date().toTimeString(), alignment: "right" },
        { text: ``, alignment: "center" },
        {
          style: "tableExample",
          table: {
            body: finalValuestoPrint,
          },
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 15, 0, 0],
        },
        story: {
          italic: true,
          alignment: "center",
          width: "50%",
        },
      },
    };
    this.pdfObj = pdfMake.createPdf(docDefinition);
  }

  reimbursementSearchBarChange(event: any) {
    const searchValue = event.detail.value;
    if (searchValue == "" || searchValue == null || searchValue == undefined) {
      this.reimbursementByEmploy = this.reimbursementFilterList;
    } else {
      this.reimbursementByEmploy = this.reimbursementFilterList.filter((itm) =>
        String(itm.email)
          .toLowerCase()
          .startsWith(String(searchValue).toLowerCase())
      );
    }
  }

  async performRejectActionReimbursement(selectedItem) {
    console.log("selectedItem ==>", selectedItem);
    const confirmAlert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Do you want to proceed?",
      message: `By clicking on confirm, 
      Reimbursement request by <strong>${selectedItem.email}</strong> will <strong>Reject</strong>. If you want to proceed please click on Confirm.`,
      inputs: [
        {
          type: "textarea",
          name: "Remarks",
          placeholder: "Remarks...",
        },
      ],
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
          handler: (res) => {
            console.log("res", res);
            if (
              res.Remarks === "" ||
              res.Remarks === null ||
              res.Remarks === undefined
            ) {
              this._toast.showWarning("Remarks are mandatory");
              return false;
            } else {
              const finalData: any = {
                amount: selectedItem.amount,
                companyId: selectedItem.companyId,
                destination: selectedItem.destination,
                email: selectedItem.email,
                employeeId: selectedItem.employeeId,
                expenseDate: selectedItem.expenseDate,
                hrRemarks: res.Remarks,
                origin: selectedItem.origin,
                phone: selectedItem.phone,
                reimbursementType: selectedItem.reimbursementType,
                remarks: selectedItem.remarks,
                status: "Rejected",
                _id: selectedItem._id,
              };
              this._emp.updateReimbursementStatus(finalData).subscribe(
                (response: any) => {
                  if (isNullOrUndefined(response.error)) {
                    this.loadReimbursement();
                    this._toast.showWarning(
                      `${selectedItem.email}'s Reimbursement Request Is Rejected.`
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
            }
          },
        },
      ],
      // backdropDismiss: false,
    });

    await confirmAlert.present();
  }

  async performApproveActionReimbursement(selectedItem) {
    console.log("selectedItem ==>", selectedItem);
    const confirmAlert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Do you want to proceed?",
      message: `By clicking on confirm, 
      Reimbursement request by <strong>${selectedItem.email}</strong> will <strong>Approve</strong>. If you want to proceed please click on Confirm.`,
      inputs: [
        {
          type: "textarea",
          name: "Remarks",
          placeholder: "Remarks...",
        },
      ],
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
          handler: (res) => {
            console.log("res", res);
            if (
              res.Remarks === "" ||
              res.Remarks === null ||
              res.Remarks === undefined
            ) {
              this._toast.showWarning("Remarks are mandatory");
              return false;
            } else {
              const finalData: any = {
                amount: selectedItem.amount,
                companyId: selectedItem.companyId,
                destination: selectedItem.destination,
                email: selectedItem.email,
                employeeId: selectedItem.employeeId,
                expenseDate: selectedItem.expenseDate,
                hrRemarks: res.Remarks,
                origin: selectedItem.origin,
                phone: selectedItem.phone,
                reimbursementType: selectedItem.reimbursementType,
                remarks: selectedItem.remarks,
                status: "Approved",
                _id: selectedItem._id,
              };
              this._emp.updateReimbursementStatus(finalData).subscribe(
                (response: any) => {
                  if (isNullOrUndefined(response.error)) {
                    this.loadReimbursement();
                    this._toast.showWarning(
                      `${selectedItem.email}'s Reimbursement Request Is Approved.`
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
            }
          },
        },
      ],
      // backdropDismiss: false,
    });

    await confirmAlert.present();
  }

  /**
   * Reimbursement End
   */

  /**
   * Advance Start
   */
  isAdvanceLoad: Subscription;
  advanceByEmploy: any;
  advanceFilterList: any;
  loadAdvance() {
    if (this.isAdvanceLoad) {
      this.isAdvanceLoad.unsubscribe();
    }
    this.isAdvanceLoad = this._emp
      .getRequestAdvance(this.EmpData._id)
      .subscribe(
        (response: any) => {
          if (isNullOrUndefined(response.error)) {
            this.advanceByEmploy = response.data.advanceDetails;
            this.advanceFilterList = response.data.advanceDetails;
            // this.countTotal(response.data.advanceDetails);
            this.createAdvancePdf();
          } else {
            this._toast.showWarning("Something Went Wrong. Please try again");
          }
        },
        (err) => {
          this._toast.showWarning(err.error.error);
        }
      );
  }

  createAdvancePdf() {}

  advanceSearchBarChange(event) {
    const searchValue = event.detail.value;
    if (searchValue == "" || searchValue == null || searchValue == undefined) {
      this.advanceByEmploy = this.advanceFilterList;
    } else {
      this.advanceByEmploy = this.advanceFilterList.filter((itm) =>
        String(itm.email)
          .toLowerCase()
          .startsWith(String(searchValue).toLowerCase())
      );
    }
  }

  async performRejectActionAdvance(selectedItem) {
    console.log("selectedItem ==>", selectedItem);
    const confirmAlert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Do you want to proceed?",
      message: `By clicking on confirm, 
      Advance request by <strong>${selectedItem.email}</strong> will <strong>Reject</strong>. If you want to proceed please click on Confirm.`,
      inputs: [
        {
          type: "textarea",
          name: "Remarks",
          placeholder: "Remarks...",
        },
      ],
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
          handler: (res) => {
            console.log("res", res);
            if (
              res.Remarks === "" ||
              res.Remarks === null ||
              res.Remarks === undefined
            ) {
              this._toast.showWarning("Remarks are mandatory");
              return false;
            } else {
              const finalData: any = {
                amount: selectedItem.amount,
                companyId: selectedItem.companyId,
                email: selectedItem.email,
                employeeId: selectedItem.employeeId,
                expenseDate: selectedItem.expenseDate,
                hrRemarks: res.Remarks,
                phone: selectedItem.phone,
                advanceType: selectedItem.advanceType,
                remarks: selectedItem.remarks,
                status: "Rejected",
                _id: selectedItem._id,
              };
              this._emp.updateAdvanceStatus(finalData).subscribe(
                (response: any) => {
                  if (isNullOrUndefined(response.error)) {
                    this.loadAdvance();
                    this._toast.showWarning(
                      `${selectedItem.email}'s Advance Request Is Rejected.`
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
            }
          },
        },
      ],
      // backdropDismiss: false,
    });

    await confirmAlert.present();
  }

  async performApproveActionAdvance(selectedItem) {
    console.log("selectedItem ==>", selectedItem);
    const confirmAlert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Do you want to proceed?",
      message: `By clicking on confirm, 
      Advance request by <strong>${selectedItem.email}</strong> will <strong>Approve</strong>. If you want to proceed please click on Confirm.`,
      inputs: [
        {
          type: "textarea",
          name: "Remarks",
          placeholder: "Remarks...",
        },
      ],
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
          handler: (res) => {
            console.log("res", res);
            if (
              res.Remarks === "" ||
              res.Remarks === null ||
              res.Remarks === undefined
            ) {
              this._toast.showWarning("Remarks are mandatory");
              return false;
            } else {
              const finalData: any = {
                amount: selectedItem.amount,
                companyId: selectedItem.companyId,
                email: selectedItem.email,
                employeeId: selectedItem.employeeId,
                expenseDate: selectedItem.expenseDate,
                hrRemarks: res.Remarks,
                phone: selectedItem.phone,
                reimbursementType: selectedItem.reimbursementType,
                remarks: selectedItem.remarks,
                status: "Approved",
                _id: selectedItem._id,
              };
              this._emp.updateAdvanceStatus(finalData).subscribe(
                (response: any) => {
                  if (isNullOrUndefined(response.error)) {
                    this.loadAdvance();
                    this._toast.showWarning(
                      `${selectedItem.email}'s Advance Request Is Approved.`
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
            }
          },
        },
      ],
      // backdropDismiss: false,
    });

    await confirmAlert.present();
  }

  /**
   * Advance End
   */

  /**
   * Attendance Start
   */
  attendanceList: any[] = [];
  isAttendanceLoading: Subscription;
  loadAttendance() {
    if (this.isAttendanceLoading) {
      this.isAttendanceLoading.unsubscribe();
    }
    const data = {
      employeeId: this.EmpData._id,
      companyId: this.EmpData.companyId,
      startFrom: "",
      endTo: "",
    };
    this.isAttendanceLoading = this._emp.empFetchPunch(data).subscribe(
      (response: any) => {
        if (isNullOrUndefined(response.error)) {
          this.attendanceList = response.data.details;
          // this.attendanceFilterList = response.data.advanceDetails;
          // this.createAdvancePdf();
        } else {
          this._toast.showWarning("Something Went Wrong. Please try again");
        }
      },
      (err) => {
        this._toast.showWarning(err.error.error);
      }
    );
  }

  diff_minutes(startTime, StopTime) {
    var date1 = new Date(`08/05/2015 ${startTime}`);
    var date2 = new Date(`08/05/2015 ${StopTime}`);
    var diff = date2.getTime() - date1.getTime();
    var msec = diff;
    var hh = Math.floor(msec / 1000 / 60 / 60);
    msec -= hh * 1000 * 60 * 60;
    var mm = Math.floor(msec / 1000 / 60);
    msec -= mm * 1000 * 60;
    var ss = Math.floor(msec / 1000);
    msec -= ss * 1000;
    return `${hh}:${mm}:${ss.toFixed(2)}`;
  }

  /**
   * Attendance end
   */

  ngOnDestroy() {
    if (this.isLeaveLoad) {
      this.isLeaveLoad.unsubscribe();
    }
    if (this.isReimburseLoad) {
      this.isReimburseLoad.unsubscribe();
    }
    if (this.isAdvanceLoad) {
      this.isAdvanceLoad.unsubscribe();
    }
    if (this.isAttendanceLoading) {
      this.isAttendanceLoading.unsubscribe();
    }
    if (this.isEmployeeLoading) {
      this.isEmployeeLoading.unsubscribe();
    }

    this.EmpData = null;
    this.CmpData = null;
  }

  /**
   * searchSalaryByMonth
   */
  monthForSalary = "";
  monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  salaryDetails = [];
  salaryMonth = "";
  uniqueSite = [];
  searchSalaryByMonth() {
    if (
      this.monthForSalary !== undefined &&
      this.monthForSalary !== null &&
      this.monthForSalary !== ""
    ) {
      this.salaryMonth = `${
        this.monthNames[new Date(this.monthForSalary).getMonth()]
      }-${new Date(this.monthForSalary).getFullYear()}`;

      this._util.showLoader();
      let data = {
        month: this.salaryMonth,
        companyID: this.companyDetails._id,
      };
      this._emp.getSalaryDetailsByMonth(data).subscribe(
        (response: any) => {
          this.salaryDetails = response.data.salaryDetails;
          if (this.salaryDetails.length > 0) {
            this.uniqueSite = [
              ...new Set(response.data.salaryDetails.map((obj) => obj.SITE)),
            ];
            this.calculateTotalNet()
          }
        },
        (err) => {
          this._toast.showWarning(err.error.error);
        }
      );
    } else {
      this.salaryMonth = "";
    }
  }
  totalNetExpense : number = 0;
  totalNetHRA : number = 0;
  calculateTotalNet(){
    for (const iterator of this.salaryDetails) {
      this.totalNetExpense += Number(iterator.NETEARNING);
      this.totalNetHRA += Number(iterator.HRA);
    }
  }
  /**
   * downloadSalaryReports
   */
  downloadSalaryReports() {
    console.log("downloadSalaryReports ===>");
    /**
     * creating the pdf data - start
     */
    let values = [
      [
        { text: "Emp Id", bold: false },
        { text: "Emp Name", bold: false },
        { text: "Griss Fixed", bold: false },
        { text: "Paid Day", bold: false },
        { text: "Basic", bold: false },
        { text: "DA", bold: false },
        { text: "HRA", bold: false },
        { text: "Conv. All", bold: false },
        { text: "Prod. Incentive", bold: false },
        { text: "Other Earning", bold: false },
        { text: "Wash All", bold: false },
        { text: "Gross Salary", bold: true },
        { text: "PF", bold: false },
        { text: "PTAX", bold: false },
        { text: "ESIC", bold: false },
        { text: "LWF", bold: false },
        { text: "Loan Dedn.", bold: false },
        { text: "Adv. Dedn.", bold: false },
        { text: "Other Dedn.", bold: false },
        { text: "Gross Dedn.", bold: true },
        { text: "Net Sal.", bold: true },
        { text: "Cheque Number", bold: true },
      ],
    ];
    for (let itm of this.salaryDetails) {
      values.push([
        itm.empName,
        itm.employeeId,
        itm.GROSSFIXED,
        itm.paidDays,
        itm.BASIC,
        itm.DA,
        itm.HRA,
        itm.ConvAll,
        itm.ProdIncentive,
        itm.OtherEarning,
        itm.WashAll,
        { text: itm.GROSSEARNING, bold: true },
        itm.PF,
        itm.PTAX,
        itm.ESICEmployee,
        itm.MLWF,
        itm.LoanDeduction,
        itm.AdvDeduction,
        itm.OtherDeduction,
        { text: itm.GROSSDEDUCION, bold: true },
        { text: itm.NETEARNING, bold: true },
        itm.CHEQUE,
      ]);
    }

    const finalValuestoPrint = values;
    /* End here */
    var docDefinition = {
      // watermark: {
      //   text: `${this.companyDetails.companyName}`,
      //   color: "blue",
      //   opacity: 0.2,
      //   bold: false,
      //   italics: false,
      // },
      content: [
        {
          text: `Alert Care`,
          style: "header",
          color: "black",
          bold: true,
          alignment: "center",
        },
        {
          text: `Salary Register for the month of ${this.salaryMonth}`,
          color: "black",
          bold: true,
          alignment: "center",
        },
        { text: ` `, alignment: "center" },
        {
          style: "tableExample",
          fontSize: 5,
          table: {
            body: finalValuestoPrint,
          },
        },
      ],
      styles: {
        header: {
          fontSize: 7,
          bold: true,
        },
        subheader: {
          fontSize: 5,
          bold: false,
          margin: [0, 0, 0, 0],
        },
        story: {
          italic: true,
          alignment: "center",
          width: "100%",
        },
      },
    };
    this.pdfObj = pdfMake.createPdf(docDefinition);

    /**
     * download pdf format from the below code
     */
    if (this.plt.is("cordova")) {
      this.pdfObj.getBuffer((buffer) => {
        var blob = new Blob([buffer], { type: "application/pdf" });

        // Save the PDF to the data Directory of our App
        this.file
          .writeFile(this.file.dataDirectory, "reimbursements.pdf", blob, {
            replace: true,
          })
          .then((fileEntry) => {
            // Open the PDf with the correct OS tools
            this.fileOpener.open(
              this.file.dataDirectory + "reimbursements.pdf",
              "application/pdf"
            );
          });
      });
    } else {
      // On a browser simply use download!
      this.pdfObj.download();
    }
    // end
  }
  /**
   * downloadCSVSalaryReport download the CSV format from below Code
   */
  downloadCSVSalaryReport() {
    console.log("downloadCSVSalaryReport clicked===>");
    let data = [];
    for (const itm of this.salaryDetails) {
      data.push({
        empName: itm.empName,
        employeeId: itm.employeeId,
        GROSSFIXED: itm.GROSSFIXED,
        paidDays: itm.paidDays,
        BASIC: itm.BASIC,
        DA: itm.DA,
        HRA: itm.HRA,
        ConvAll: itm.ConvAll,
        ProdIncentive: itm.ProdIncentive,
        OtherEarning: itm.OtherEarning,
        WashAll: itm.WashAll,
        GROSSEARNING: itm.GROSSEARNING,
        PF: itm.PF,
        PTAX: itm.PTAX,
        ESICEmployee: itm.ESICEmployee,
        MLWF: itm.MLWF,
        LoanDeduction: itm.LoanDeduction,
        AdvDeduction: itm.AdvDeduction,
        OtherDeduction: itm.OtherDeduction,
        GROSSDEDUCION: itm.GROSSDEDUCION,
        NETEARNING: itm.NETEARNING,
        CHEQUE: itm.CHEQUE,
      });
    }
    const options = {
      fieldSeparator: ",",
      quoteStrings: '"',
      decimalSeparator: ".",
      showLabels: true,
      showTitle: true,
      filename: `${this.salaryMonth}`,
      title: `Salary Report For - ${this.salaryMonth}`,
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
    };
    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(data);
  }

  deleteSelectedMonthSalary() {
    let selectedItems = [];
    for (const iterator of this.salaryDetails) {
      if (iterator.checked) {
        selectedItems.push(iterator._id);
      }
    }
    if (selectedItems.length > 0) {
      this._util.showLoader();
      this._emp.deleteEmployeeCalculatedSalaries(selectedItems).subscribe(
        (response: any) => {
          if (isNullOrUndefined(response.error)) {
            this._toast.showWarning(`Punch Deleted Successfully`);
            this.searchSalaryByMonth();
          } else {
            this._toast.showWarning(
              "Something Went Wrong While Deleting Salaries. Please try again"
            );
          }
        },
        (err) => {
          this._toast.showWarning(err.error.error);
        }
      );
    } else {
      this._toast.showWarning(
        "Please Select Salary Row Checkbox Which You Want To Delete."
      );
    }
  }

    /**
   * downloadPaySlip
   */
     downloadPaySlip(data) {
      this.createLeavePdfForSalarySlip(data);
    }
    /**
     * create pdf
     */
    pdfObjForSalarySlip = null;
    monthNamesForSalarySlip = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    createLeavePdfForSalarySlip(emp) {
      const selectedEmployee = emp;
      console.log(selectedEmployee)
      /**
       * creating the pdf data - start
       */
      const finalValuestoPrint = [
        [this.companyDetails.companyName],
        ["SALARY PAYBALE FOR THE MONTH OF", selectedEmployee.month],
      ];
  
      const finalPage = [
        // {
        //   text: `${this.CmpData.companyName}`,
        //   style: "header",
        //   color: "blue",
        //   bold: true,
        //   alignment: "center",
        // },
        {
          image: GLOBAL.logo,
          alignment: "left",
        },
        {
          text: `PAY SLIP - ${
            this.monthNames[new Date(selectedEmployee.month).getMonth()]
          }-${new Date(selectedEmployee.month).getFullYear()}`,
          bold: true,
          alignment: "center",
        },
        { text: ` `, alignment: "center" },
        { text: ` `, alignment: "center" },
        // { text: new Date().toTimeString(), alignment: "right" },
        { text: ``, alignment: "center" },
        {
          layout: "lightHorizontalLines", // optional
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 1,
            widths: ["*", "auto", 100, "*"],
            body: [
              ["", "", ``, ""], // `${this.CmpData.companyName}
              [
                "EMP NAME",
                `${selectedEmployee.empName}`,
                "EMP ID",
                `${selectedEmployee.employeeId}`,
              ],
              [
                { text: "EARNING", bold: true },
                "",
                { text: "DEDUCTION", bold: true },
                "",
              ],
              [
                { text: "BASIC" },
                `${selectedEmployee.BASIC}`,
                { text: "EPFEmployee" },
                `${selectedEmployee.EPFEmployee}`,
              ],
              [
                { text: "DA" },
                `${selectedEmployee.DA}`,
                { text: "ESICEmployee" },
                `${selectedEmployee.ESICEmployee}`,
                // { text: "EPFEmployer" },
                // `${this.finalCalculation.EPFEmployer}`,
              ],
              [
                { text: "SpecialAllowance" },
                `${selectedEmployee.SpecialAllowance}`,
                { text: "PT" },
                `${selectedEmployee.PT}`,
              ],
              [
                { text: "OtherAllowance" },
                `${selectedEmployee.OtherAllowance}`,
                ``,
                ``,
              ],
              [
                { text: "" },
                ``,
                { text: "MLWF" },
                `${selectedEmployee.MLWF}`,
              ],
              [
                { text: "" },
                ``,
                { text: "OtherDeduction" },
                `${selectedEmployee.OtherDeduction}`,
              ],
              [
                { text: "GROSS EARNING", bold: true },
                { text: `${selectedEmployee.GROSSEARNING}`, bold: true },
                { text: "GROSS DEDUCTION", bold: true },
                { text: `${selectedEmployee.GROSSDEDUCION}`, bold: true },
              ],
              [
                { text: "NET EARNING", bold: true },
                { text: `${selectedEmployee.NETEARNING}`, bold: true },
                { text: "" },
                { text: `` },
              ],
            ],
          },
        },
        {
          text: "System generated no seal / signature required.",
          alignment: "left",
        },
      ];
      /**
       * looping the filtered employee site vise - start
       */
  
      /**
       * looping the filtered employee site vise - end
       */
      var docDefinition = {
        watermark: {
          text: `${this.companyDetails.companyName}`,
          color: "blue",
          opacity: 0.1,
          bold: false,
          italics: false,
        },
        content: finalPage,
        styles: {
          header: {
            fontSize: 18,
            bold: true,
          },
          subheader: {
            fontSize: 14,
            bold: true,
            margin: [0, 15, 0, 0],
          },
          story: {
            italic: true,
            alignment: "center",
            width: "50%",
          },
        },
      };
      this.pdfObjForSalarySlip = pdfMake.createPdf(docDefinition);
      this.downloadSalarySlipPdf();
    }
  
    downloadSalarySlipPdf() {
      if (this.plt.is("cordova")) {
        this.pdfObjForSalarySlip.getBuffer((buffer) => {
          var blob = new Blob([buffer], { type: "application/pdf" });
  
          // Save the PDF to the data Directory of our App
          this.file
            .writeFile(this.file.dataDirectory, "reimbursements.pdf", blob, {
              replace: true,
            })
            .then((fileEntry) => {
              // Open the PDf with the correct OS tools
              this.fileOpener.open(
                this.file.dataDirectory + "reimbursements.pdf",
                "application/pdf"
              );
            });
        });
      } else {
        // On a browser simply use download!
        this.pdfObjForSalarySlip.download();
      }
    }
}
