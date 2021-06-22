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
import { UploadCSVPunchComponent } from "../upload-punch-csv/upload-punch-csv.component";

@Component({
  selector: "app-manualPunch",
  templateUrl: "./manualPunch.component.html",
  styleUrls: ["./manualPunch.component.scss"],
})
export class manualPunchComponent implements OnInit, OnChanges {
  public main: string;
  EmpData: any = null;
  CmpData: any = null;
  @Output() public successFullyRegister = new EventEmitter();
  @Input("companyDetails") companyDetails: any;
  siteSelected: any;
  isEmployeeLoading: Subscription;
  constructor(
    private _emp: EmployeeService,
    private _api: ApiUrlService,
    private _toast: ToastService,
    private plt: Platform,
    private file: File,
    private fileOpener: FileOpener,
    private modalController: ModalController
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
   * load company employee details
   */
  employees: any = [];
  sites: any = [];
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
            const uniqueSite = [
              ...new Set(response.data.employeeList.map((obj) => obj.Site)),
            ];
            this.sites = uniqueSite;
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
   * Null check
   */
  isNull(val) {
    return val == "" || val == null || val == undefined;
  }
  /**
   * siteChange
   */
  sitesEmployee = [];
  siteChange(event) {
    console.log("===>", event);
    this.sitesEmployee = this.employees.filter((item) => {
      return item.Site === event.detail.value;
    });
    console.log("sitesEmployees ===>", this.sitesEmployee);
  }

  submit() {
    console.log("sitesEmployees ===>", this.sitesEmployee);
    const employeeSelectedForPunch = this.sitesEmployee.filter((item) => {
      return item.isSelectedForPunch === true;
    });
    const valid = this.validateSubmit(employeeSelectedForPunch);
    if (employeeSelectedForPunch.length == 0) {
      this._toast.showWarning("Please select site and employee to proceed.");
    } else {
      if (valid) {
        console.log("simit data", employeeSelectedForPunch);
        for (let i = 0; i < employeeSelectedForPunch.length; i++) {
          const punchStartTime = new Date(
            employeeSelectedForPunch[i].punchStartTime
          );
          employeeSelectedForPunch[i].punchStartTime =
            punchStartTime.getHours() +
            ":" +
            punchStartTime.getMinutes() +
            ":" +
            punchStartTime.getSeconds();
          const punchStopTime = new Date(
            employeeSelectedForPunch[i].punchStopTime
          );
          employeeSelectedForPunch[i].punchStopTime =
            punchStopTime.getHours() +
            ":" +
            punchStopTime.getMinutes() +
            ":" +
            punchStopTime.getSeconds();
          const punchDateSelected = new Date(
            employeeSelectedForPunch[i].punchDateSelected
          );
          employeeSelectedForPunch[i].punchDateSelected = `${
            punchDateSelected.getMonth() + 1
          }/${punchDateSelected.getDate()}/${punchDateSelected.getFullYear()}`;
        }
        if (this.isEmployeeLoading) {
          this.isEmployeeLoading.unsubscribe();
        }
        this.isEmployeeLoading = this._emp
          .startMultiplePunch({ data: employeeSelectedForPunch })
          .subscribe(
            (response: any) => {
              console.log("response", response);
              if (isNullOrUndefined(response.error)) {
                console.log("response", response);
                this._toast.showWarning(
                  "Successfully punched for selected employee's."
                );
                this.backToMain();
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
      } else {
        this._toast.showWarning(
          "Please Try with fill all required value in selected employee."
        );
      }
    }
  }

  validateSubmit(data) {
    let output = true;
    for (let itm of data) {
      if (
        this.isNull(itm.punchDateSelected) ||
        this.isNull(itm.punchDateSelected) ||
        this.isNull(itm.punchDateSelected)
      ) {
        output = false;
      }
    }
    return output;
  }
  /**
   * downloadSiteCSV
   */
  downloadSiteCSV() {
    console.log("downloadSiteCSV clicked");
    var data = [];

    for (const iterator of this.sitesEmployee) {
      data.push({
        empId: iterator._id,
        empName: iterator.empname,
        Site: iterator.Site,
        punchDate: "",
        StartTime: "",
        StopTime: "",
      });
    }
    const options = {
      fieldSeparator: ",",
      quoteStrings: '"',
      decimalSeparator: ".",
      showLabels: true,
      showTitle: true,
      title: `Please Fill Punch Detail's For Site - ${this.sitesEmployee[0].Site}`,
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
    };
    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(data);
  }
  /**
   * downloadSiteCSV
   */
  downloadAll() {
    console.log("downloadSiteCSV clicked");
    var data = [];

    for (const iterator of this.employees) {
      data.push({
        empId: iterator._id,
        empName: iterator.empname,
        Site: iterator.Site,
        punchDate: "",
        StartTime: "",
        StopTime: "",
      });
    }
    const options = {
      fieldSeparator: ",",
      quoteStrings: '"',
      decimalSeparator: ".",
      showLabels: true,
      showTitle: true,
      title: `Please Fill Punch Detail's`,
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
    };
    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(data);
  }
  /**
   * uploadPunchCSV
   */
  async uploadPunchCSV() {
    const modal = await this.modalController.create({
      component: UploadCSVPunchComponent,
      cssClass: "modal-fullscreen",
      componentProps: {
        companyDetails: this.companyDetails,
      },
    });
    modal.onDidDismiss().then((data) => {
      this.sitesEmployee = [];
      this.siteSelected = null;
      console.log("pop up closed");
    });
    return await modal.present();
  }
}
