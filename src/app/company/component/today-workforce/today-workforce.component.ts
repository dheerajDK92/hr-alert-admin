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
@Component({
  selector: "app-today-workforce",
  templateUrl: "./today-workforce.component.html",
  styleUrls: ["./today-workforce.component.scss"],
})
export class TodayWorkForceComponent implements OnInit, OnChanges {
  public main: string;
  EmpData: any = null;
  CmpData: any = null;
  @Output() public successFullyRegister = new EventEmitter();
  @Input("companyDetails") companyDetails: any;

  isEmployeeLoading: Subscription;
  constructor(private _emp: EmployeeService, private _toast: ToastService) {}

  backToMain() {
    this.successFullyRegister.emit("true");
  }

  ngOnChanges(changes: any) {
    console.log("changes ===>", changes);
    if (changes.companyDetails) {
      this.companyDetails = changes.companyDetails.currentValue;
    }
  }
  punchDate: any;
  ngOnInit() {
    // this.loadCompanyEmp();
    const dateNow = new Date();
    this.punchDate = `${
      dateNow.getMonth() + 1
    }/${dateNow.getDate()}/${dateNow.getFullYear()}`;
    this.loadCompanyEmp();
  }
  /**
   * load company employee details
   */
  employees: any[] = [];
  filterList: any[] = [];
  loadCompanyEmp() {
    if (this.isEmployeeLoading) {
      this.isEmployeeLoading.unsubscribe();
    }
    this.isEmployeeLoading = this._emp
      .getCompanyEmployeeDetail(this.companyDetails._id)
      .subscribe(
        (response: any) => {
          if (isNullOrUndefined(response.error)) {
            this.employees = response.data.employeeList;
            this.filterList = response.data.employeeList;

            this.loadTodayAvailableEmplyees();
            console.log("employees ===>", this.employees);
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
   * get the today available emp
   */
  availableEmployee = [];
  loadTodayAvailableEmplyees() {
    this._emp
      .getTodayWorkForce({
        punchDate: this.punchDate,
        companyId: this.companyDetails._id,
      })
      .subscribe(
        (response: any) => {
          if (isNullOrUndefined(response.error)) {
            this.availableEmployee = response.data.details;
            this.getAvailableEmployeeDetails();
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
   * filter for emp availablity
   */
  availableEmpList = [];
  filterAvailableEmpList = [];
  unavailableEmpList = [];
  filterUnavailableEmpList = [];
  getAvailableEmployeeDetails() {
    if (this.availableEmployee.length > 0) {
      for (let itm of this.availableEmployee) {
        for (let i = 0; i < this.employees.length - 1; i++) {
          if (this.employees[i]._id == itm.employeeId) {
            this.availableEmpList.push(this.employees[i]);
          } else {
            this.unavailableEmpList.push(this.employees[i]);
          }
        }
      }
      this.filterAvailableEmpList = [...this.availableEmpList];
      this.filterUnavailableEmpList = [...this.unavailableEmpList];
    } else {
      this.unavailableEmpList = [...this.employees];
      this.filterUnavailableEmpList = [...this.employees];
      // this._util.hideLoader();
    }
  }
  /**
   * search
   */
  searchBarChange(event: any) {
    const searchValue = event.detail.value;
    if (searchValue == "" || searchValue == null || searchValue == undefined) {
      this.availableEmpList = this.filterAvailableEmpList;
      this.unavailableEmpList = this.filterUnavailableEmpList;
    } else {
      this.availableEmpList = this.filterAvailableEmpList.filter(
        (itm) =>
          String(itm.empname)
            .toLowerCase()
            .startsWith(String(searchValue).toLowerCase()) ||
          String(itm.empID)
            .toLowerCase()
            .startsWith(String(searchValue).toLowerCase()) ||
          String(itm.Site)
            .toLowerCase()
            .startsWith(String(searchValue).toLowerCase())
      );
      this.unavailableEmpList = this.filterUnavailableEmpList.filter(
        (itm) =>
          String(itm.empname)
            .toLowerCase()
            .startsWith(String(searchValue).toLowerCase()) ||
          String(itm.empID)
            .toLowerCase()
            .startsWith(String(searchValue).toLowerCase()) ||
          String(itm.Site)
            .toLowerCase()
            .startsWith(String(searchValue).toLowerCase())
      );
    }
  }
}
