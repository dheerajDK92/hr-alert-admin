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
import { UpdateEmployeeComponent } from "../update-employee/update-employee.component";
import { AlertController, ModalController, Platform } from "@ionic/angular";
import { AddLogoComponent } from "../add-logo/add-logo.component";
import { UploadCSVComponent } from "../upload-csv/upload-csv.component";
import { ProofStatusComponent } from "../proof-status/proof-status.component";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { File } from "@ionic-native/file/ngx";
import { FileOpener } from "@ionic-native/file-opener/ngx";
import { Subscription } from "rxjs";
import { EmployeeIDComponent } from "../employee-id/employee-id.component";
import { ExportToCsv } from "export-to-csv";

@Component({
  selector: "app-employee-list",
  templateUrl: "./employee-list.component.html",
  styleUrls: ["./employee-list.component.scss"],
})
export class EmployeeListComponent implements OnInit, OnChanges, OnDestroy {
  skelton: boolean = true;
  empList: any[] = [];
  filterList: any[] = [];
  showNoEntryForEmployee: boolean = true;
  constructor(
    private _emp: EmployeeService,
    private _toast: ToastService,
    private modalController: ModalController,
    private plt: Platform,
    private file: File,
    private fileOpener: FileOpener,
    private alertController: AlertController
  ) {}
  @Output() public changeView = new EventEmitter();
  @Input("companydata") companydata: any;

  ngOnChanges(changes: any) {
    if (changes.companydata) {
      this.companydata = changes.companydata.currentValue;
    }
  }

  ngOnInit() {
    this.skelton = true;
    setTimeout(() => {
      this._emp.getEmployeeList(this.companydata).subscribe(
        (response: any) => {
          this.skelton = false;
          if (isNullOrUndefined(response.error)) {
            if (!isNullOrUndefined(response.data.employeeList))
              this.empList = response.data.employeeList;
            this.filterList = response.data.employeeList;
            this.createPdf();
            if (this.empList.length <= 0) {
              this.showNoEntryForEmployee = true;
            } else {
              this.showNoEntryForEmployee = false;
              this.empList = response.data.employeeList;
            }
            this.skelton = false;
          } else {
            this._toast.showWarning("Something Went Wrong. Please try again");
          }
        },
        (err) => {
          this.skelton = false;
          this._toast.showWarning(err.error.error);
        }
      );
    }, 1000);
  }

  updateToggleChange(event, data) {
    // data.isHrAdmin = event.detail.checked;
    const FinalData = {
      empname: data.empname,
      empID: data.empID,
      Site: data.Site,
      designation: data.designation,
      DOB: data.DOB,
      DOJ: data.DOJ,
      DOL: data.DOL,
      isMonthlyCalculation: data.isMonthlyCalculation,
      gender: data.gender,
      isHrAdmin: event.detail.checked,
      companyId: data.companyId,
      phone: data.phone,
      email: data.email,
      password: data.password,
      address: data.address,
      address2: data.address2,
      pincode: data.pincode,
      city: data.city,
      state: data.state,
      country: data.country,
      description: data.description,
      startTime: data.startTime,
      endtTime: data.endtTime,
      halfDayApplicable: data.halfDayApplicable,
      minHoursOfHalfDay: data.minHoursOfHalfDay,
      maxHoursOfContinousWork: data.maxHoursOfContinousWork,
      weeklyOffs: data.weeklyOffs,
      selfAttendanceMethod: data.selfAttendanceMethod,
      attendanceFromOffice: data.attendanceFromOffice,
      imageWithAttendance: data.imageWithAttendance,
      overTimeApplicable: data.overTimeApplicable,
      BASIC: data.BASIC,
      DA: data.DA,
      SpecialAllowance: data.SpecialAllowance,
      OtherAllowance: data.OtherAllowance,
      HRA: data.HRA,
      TotalEarning: data.TotalEarning,
      ESICEmployer: data.ESICEmployer,
      EPFEmployer: data.EPFEmployer,
      ESICEmployee: data.ESICEmployee,
      EPFEmployee: data.EPFEmployee,
      PT: data.PT,
      MLWF: data.MLWF,
      OtherDeduction: data.OtherDeduction,
      TotalDeduction: data.TotalDeduction,
      NetTotal: data.NetTotal,
      _id: data._id,
    };
    this.updateEmployee(FinalData);
  }

  updateToggleForMonthly(event, data) {
    // data.isHrAdmin = event.detail.checked;
    const FinalData = {
      empname: data.empname,
      empID: data.empID,
      Site: data.Site,
      designation: data.designation,
      DOB: data.DOB,
      DOJ: data.DOJ,
      DOL: data.DOL,
      gender: data.gender,
      isHrAdmin: data.isHrAdmin,
      isMonthlyCalculation: event.detail.checked,
      companyId: data.companyId,
      phone: data.phone,
      email: data.email,
      password: data.password,
      address: data.address,
      address2: data.address2,
      pincode: data.pincode,
      city: data.city,
      state: data.state,
      country: data.country,
      description: data.description,
      startTime: data.startTime,
      endtTime: data.endtTime,
      halfDayApplicable: data.halfDayApplicable,
      minHoursOfHalfDay: data.minHoursOfHalfDay,
      maxHoursOfContinousWork: data.maxHoursOfContinousWork,
      weeklyOffs: data.weeklyOffs,
      selfAttendanceMethod: data.selfAttendanceMethod,
      attendanceFromOffice: data.attendanceFromOffice,
      imageWithAttendance: data.imageWithAttendance,
      overTimeApplicable: data.overTimeApplicable,
      BASIC: data.BASIC,
      DA: data.DA,
      SpecialAllowance: data.SpecialAllowance,
      OtherAllowance: data.OtherAllowance,
      HRA: data.HRA,
      TotalEarning: data.TotalEarning,
      ESICEmployer: data.ESICEmployer,
      EPFEmployer: data.EPFEmployer,
      ESICEmployee: data.ESICEmployee,
      EPFEmployee: data.EPFEmployee,
      PT: data.PT,
      MLWF: data.MLWF,
      OtherDeduction: data.OtherDeduction,
      TotalDeduction: data.TotalDeduction,
      NetTotal: data.NetTotal,
      _id: data._id,
    };
    this.updateEmployee(FinalData);
  }

  updateEmployee(data) {
    this._emp.updateEmployee(data).subscribe(
      (response: any) => {
        if (isNullOrUndefined(response.error)) {
          this.changeView.emit("employeeListView");
          this._toast.showWarning(
            `Successfully ${data.empname} detail's Updated`
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
  async manageEmp(emp: any) {
    const modal = await this.modalController.create({
      component: UpdateEmployeeComponent,
      cssClass: "modal-fullscreen",
      componentProps: {
        empData: emp,
      },
    });
    modal.onDidDismiss().then((data) => {
      if (!isNullOrUndefined(data.data.updated)) {
        this.ngOnInit();
      }
    });
    return await modal.present();
  }

  async openProofStatus(emp: any) {
    const modal = await this.modalController.create({
      component: ProofStatusComponent,
      cssClass: "modal-fullscreen",
      componentProps: {
        empData: emp,
      },
    });
    // modal.onDidDismiss().then((data) => {
    //   if (!isNullOrUndefined(data.data.updated)) {
    //     this.ngOnInit();
    //   }
    // });
    return await modal.present();
  }

  async changeProfilePic(data2) {
    const modal = await this.modalController.create({
      component: AddLogoComponent,
      cssClass: "addLogoPage",
      componentProps: {
        empData: data2,
        uploadFor: "Employee",
      },
    });

    modal.onDidDismiss().then((data) => {
      if (!isNullOrUndefined(data.data.uploaded)) {
        this.ngOnInit();
      }
    });

    return await modal.present();
  }

  async uploadMultipleEmployee() {
    const modal = await this.modalController.create({
      component: UploadCSVComponent,
      cssClass: "addLogoPage",
      componentProps: {
        companyData: this.companydata,
      },
    });

    modal.onDidDismiss().then((data) => {
      if (!isNullOrUndefined(data.data.done)) {
        this.ngOnInit();
      }
    });

    return await modal.present();
  }
  /**
   * PDF export for web and mobile start
   */
  pdfObj = null;
  createPdf() {
    /**
     * creating the pdf data - start
     */
    let values = [
      [
        { text: "Sr.", bold: true },
        { text: "EmpID", bold: true },
        { text: "Name", bold: true },
        { text: "Password", bold: true },
        { text: "Phone", bold: true },
        { text: "Site", bold: true },
      ],
    ];
    let count = 1;
    for (let itm of this.filterList) {
      values.push([
        count,
        itm.empID,
        itm.empname,
        itm.password,
        itm.phone,
        itm.Site,
      ]);
      count++;
    }

    const finalValuestoPrint = values;
    /* End here */
    var docDefinition = {
      watermark: {
        text: `${this.companydata.companyName}`,
        color: "blue",
        opacity: 0.2,
        bold: true,
        italics: false,
      },
      content: [
        {
          text: `Employee Detail's`,
          style: "header",
          color: "blue",
          bold: true,
        },
        {
          text: `Total Employee's: ${this.filterList?.length}`,
          alignment: "right",
        },
        { text: new Date().toTimeString(), alignment: "right" },
        { text: ``, alignment: "center" },
        {
          style: "tableExample",
          table: {
            headerRows: 1,
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
        table: {
          alignment: "center",
          width: "100%",
        },
      },
    };
    this.pdfObj = pdfMake.createPdf(docDefinition);
  }
  /**
   * download employees in PDF
   */
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
   * download Employee list as CSV
   */
  downloadCSV() {
    // console.log("this.companydata", this.companydata);
    // console.log("this.empList", this.empList);
    let data = [];
    for (const itm of this.empList) {
      data.push({
        empname: itm.empname == null ? "NA" : itm.empname,
        empID: itm.empID == null ? "NA" : itm.empID,
        Site: itm.Site == null ? "NA" : itm.Site,
        phone: itm.phone == null ? "NA" : itm.phone,
        designation: itm.designation == null ? "NA" : itm.designation,
        address: itm.address == null ? "NA" : itm.address,
        pincode: itm.pincode == null ? "NA" : itm.pincode,
        city: "",
        state: "",
        country: "India",
        PAN: "",
        Adhaar: "",
        IFSC: "",
        BANK: "",
        bankAccountNumber: "", // TODO
        BASIC: "",
        DA: itm.DA == null ? "NA" : itm.DA,
        SpecialAllowance:
          itm.SpecialAllowance == null ? "NA" : itm.SpecialAllowance,
        OtherAllowance: itm.OtherAllowance == null ? "NA" : itm.OtherAllowance,
        HRA: itm.HRA == null ? "NA" : itm.HRA,
        TotalEarning: itm.TotalEarning == null ? "NA" : itm.TotalEarning,
        ESICEmployer: itm.ESICEmployer == null ? "NA" : itm.ESICEmployer,
        EPFEmployer: itm.EPFEmployer == null ? "NA" : itm.EPFEmployer,
        ESICEmployee: itm.ESICEmployee == null ? "NA" : itm.ESICEmployee,
        EPFEmployee: itm.EPFEmployee == null ? "NA" : itm.EPFEmployee,
        PT: itm.PT == null ? "NA" : itm.PT,
        MLWF: itm.MLWF == null ? "NA" : itm.MLWF,
        OtherDeduction: itm.OtherDeduction == null ? "NA" : itm.OtherDeduction,
        TotalDeduction: itm.TotalDeduction == null ? "NA" : itm.TotalDeduction,
        NetTotal: itm.NetTotal == null ? "NA" : itm.NetTotal,
      });
    }
    const options = {
      fieldSeparator: ",",
      quoteStrings: '"',
      decimalSeparator: ".",
      showLabels: true,
      showTitle: true,
      filename: `${this.companydata.companyName}`,
      title: `Employee List of - ${this.companydata.companyName}`,
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
    };
    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(data);
  }

  searchBarChange(event: any) {
    const searchValue = event.detail.value;
    if (searchValue == "" || searchValue == null || searchValue == undefined) {
      this.empList = this.filterList;
    } else {
      this.empList = this.filterList.filter(
        (itm) =>
          String(itm.empname)
            .toLowerCase()
            .startsWith(String(searchValue).toLowerCase()) ||
          String(itm.empID)
            .toLowerCase()
            .startsWith(String(searchValue).toLowerCase()) ||
          String(itm.email)
            .toLowerCase()
            .startsWith(String(searchValue).toLowerCase()) ||
          String(itm.Site)
            .toLowerCase()
            .startsWith(String(searchValue).toLowerCase())
      );
    }
  }
  deleteMultipleLoading: Subscription;
  async deleteSelectedEmployee() {
    console.log("empList ==>", this.empList);
    const selected = this.empList.filter((itm) => itm.checked == true);
    let finalData = [];

    if (selected.length == 0) {
      this._toast.showWarning(
        "No Employee Selected, Please Select If You Want To Delete Multiple Employee's"
      );
    } else {
      for (let itm of selected) {
        finalData.push(itm._id);
      }
      const alert = await this.alertController.create({
        cssClass: "my-custom-class",
        header: "Do you want to proceed?",
        message: `Once You Will Delete Selected Employee. Their Data Will Be Permanently Delete from Database.`,
        buttons: [
          {
            text: "Cancel",
            role: "cancel",
            cssClass: "secondary",
            handler: (blah) => {
              console.log("Confirm Cancel: blah");
            },
          },
          {
            text: "Okay",
            handler: () => {
              this.skelton = true;
              if (this.deleteMultipleLoading) {
                this.deleteMultipleLoading.unsubscribe();
              }
              this.deleteMultipleLoading = this._emp
                .deleteMultipeEmployee(finalData)
                .subscribe(
                  (response: any) => {
                    this.skelton = false;
                    if (isNullOrUndefined(response.error)) {
                      this.ngOnInit();
                      this._toast.showWarning(
                        `Selecetd Employee's Are Successfully Deleted.`
                      );
                    } else {
                      this._toast.showWarning(
                        "Something Went Wrong While Deleting The Multiple Employee's. Please try again"
                      );
                    }
                  },
                  (err) => {
                    this.skelton = false;
                    this._toast.showWarning(err.error.error);
                  }
                );
            },
          },
        ],
      });

      await alert.present();
    }
  }
  /**
   * unsubscribe callback
   */
  ngOnDestroy() {
    if (this.deleteMultipleLoading) {
      this.deleteMultipleLoading.unsubscribe();
    }
  }
  /**
   * downloadIDCard
   */
  async downloadIDCard(employee) {
    console.log("employee ===>", employee);
    const modal = await this.modalController.create({
      component: EmployeeIDComponent,
      cssClass: "addLogoPage",
      componentProps: {
        selectedEmpDetails: employee,
      },
    });

    modal.onDidDismiss().then((data) => {
      if (!isNullOrUndefined(data.data)) {
        if (isNullOrUndefined(data.data.uploaded)) {
          this.ngOnInit();
        }
      }
    });

    return await modal.present();
  }

  selectAllEmp() {
    if (this.empList.length > 0) {
      this.empList.forEach((itm) => (itm.checked = true));
    }
  }
}
