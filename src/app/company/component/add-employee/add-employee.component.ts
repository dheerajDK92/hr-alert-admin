import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  OnChanges,
} from "@angular/core";
import { EmployeeService } from "src/app/common/service/employee.service";
import { isNullOrUndefined } from "util";
import { ToastService } from "src/app/common/service/toast.service";
import { ignoreElements } from "rxjs/operators";

@Component({
  selector: "app-add-employee",
  templateUrl: "./add-employee.component.html",
  styleUrls: ["./add-employee.component.scss"],
})
export class AddEmployeeComponent implements OnInit, OnChanges {
  constructor(private _emp: EmployeeService, private _toast: ToastService) {}
  @Output() public changeView = new EventEmitter();
  @Input("companydata") companydata: any;
  personalInfoSection = true;
  rulesSection = true;
  paymentInfoSection = true;
  addressDetailsSection = true;
  ngOnInit() {}

  ngOnChanges(changes: any) {
    if (changes.companydata) {
      this.companydata = changes.companydata.currentValue;
    }
  }

  submitUpdateCompanyForm(formData) {
    const submittedData = formData.form.value;
    const FinalData = {
      empname: submittedData.empname,
      empID: submittedData.empID,
      Site: submittedData.Site,
      isReportingManager: submittedData.isReportingManager,
      isMonthlyCalculation: submittedData.isMonthlyCalculation,
      designation: submittedData.designation,
      DOB: submittedData.DOB,
      DOJ: submittedData.DOJ,
      DOL: submittedData.DOL,
      gender: submittedData.gender,
      isHrAdmin: false,
      companyId: this.companydata._id,
      phone: String(submittedData.phone),
      email: submittedData.email,
      password: submittedData.password,
      address: submittedData.address,
      address2: submittedData.address2,
      pincode: submittedData.pincode,
      city: submittedData.city,
      state: submittedData.state,
      country: "India",
      description: submittedData.description,
      startTime: this.ReturnSelectedTime(submittedData.startTime),
      endtTime: this.ReturnSelectedTime(submittedData.endtTime),
      halfDayApplicable:
        submittedData.halfDayApplicable == ""
          ? true
          : submittedData.halfDayApplicable,
      minHoursOfHalfDay: submittedData.minHoursOfHalfDay,
      maxHoursOfContinousWork: submittedData.maxHoursOfContinousWork,
      weeklyOffs: submittedData.weeklyOffs,
      selfAttendanceMethod: submittedData.selfAttendanceMethod,
      attendanceFromOffice:
        submittedData.attendanceFromOffice == ""
          ? true
          : submittedData.attendanceFromOffice,
      fingerPrintAttendance: false,
      imageWithAttendance:
        submittedData.imageWithAttendance == ""
          ? true
          : submittedData.imageWithAttendance,
      overTimeApplicable:
        submittedData.overTimeApplicable == ""
          ? true
          : submittedData.overTimeApplicable,
      BASIC: this.BASIC,
      DA: this.DA,
      SpecialAllowance: this.SpecialAllowance,
      OtherAllowance: this.OtherAllowance,
      HRA: this.HRA,
      TotalEarning: this.TotalEarning,
      ESICEmployer: this.ESICEmployer,
      EPFEmployer: this.EPFEmployer,
      ESICEmployee: this.ESICEmployee,
      EPFEmployee: this.EPFEmployee,
      PT: this.PT,
      MLWF: this.MLWF,
      OtherDeduction: this.OtherDeduction,
      TotalDeduction: this.TotalDeduction,
      NetTotal: this.NetTotal,
    };

    const validData = this.validateEnteredData(FinalData);
    if (validData) {
      this._emp.registerEmployee(FinalData).subscribe(
        (response: any) => {
          if (isNullOrUndefined(response.error)) {
            this.changeView.emit("employeeListView");
            this._toast.showWarning("Successfully Employee Added!");
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

  showSecion(sectionClicked) {
    if (sectionClicked == "personalInfoSection") {
      this.validateScreenVisible("personalInfoSection");
    } else if (sectionClicked == "rulesSection") {
      this.validateScreenVisible("rulesSection");
    } else if (sectionClicked == "paymentInfoSection") {
      this.validateScreenVisible("paymentInfoSection");
    } else if (sectionClicked == "addressDetailsSection") {
      this.validateScreenVisible("addressDetailsSection");
    }
  }

  ReturnSelectedTime(time) {
    return String(time.split("T")[1]).substr(0, 5);
  }

  displayProp(name) {
    return document.getElementById(name).style.display;
  }
  setDisplayProp(id, value) {
    document.getElementById(id).style.display = value;
  }

  validateScreenVisible(name) {
    if (this.displayProp(name) == "none") {
      this.setDisplayProp(name, "block");
      document.getElementById(name).style.display = "block";
    } else {
      this.setDisplayProp(name, "none");
      document.getElementById(name).style.display = "none";
    }
  }
  validDobSelected = false;
  validateEnteredData(formData) {
    let output = true;
    const joiningDate = new Date(formData.DOJ);
    const leavingDate = new Date(formData.DOL);
    const currentAge = this.calculateEmpAge(new Date(formData.DOB));
    // Empty Field Validation
    if (
      this.isNullEmpty(formData.empID) ||
      this.isNullEmpty(formData.empname) ||
      this.isNullEmpty(formData.phone) ||
      this.isNullEmpty(formData.password) ||
      this.isNullEmpty(formData.Site)
    ) {
      let msg = "Please enter/select";
      this.isNullEmpty(formData.empID) ? (msg += " `Employment ID`") : "";
      this.isNullEmpty(formData.empname) ? (msg += " `Employment Name`") : "";
      this.isNullEmpty(formData.phone) ? (msg += " `Employment Phone`") : "";
      this.isNullEmpty(formData.password)
        ? (msg += " `Employment Password`")
        : "";
      this.isNullEmpty(formData.Site) ? (msg += " `Site`") : "";
      this._toast.showError(msg);
      output = false;
    }
    if (currentAge < 20) {
      this._toast.showError(
        "Employee age should be greater or equal to 20 Years as per Govt. Rules."
      );
      this.validDobSelected = true;
      output = false;
    }
    if (joiningDate > leavingDate) {
      this._toast.showError(
        "Employee company leaving date should be greater than joining date."
      );
      output = false;
    }

    return output;
  }

  isNullEmpty(value) {
    return value == "" || value == null || value == undefined;
  }

  calculateEmpAge(dob) {
    var diff_ms = Date.now() - dob.getTime();
    var age_dt = new Date(diff_ms);
    return Math.abs(age_dt.getUTCFullYear() - 1970);
  }

  /**
   * calculation - start
   */
  manualCalculation: boolean = true;
  manualCalChange(event) {
    console.log("event", event);
    this.manualCalculation = event.detail.checked;
  }
  BASIC: any = 0;
  DA: any = 0;
  NetTotal: any = 0;
  TotalDeduction: any = 0;
  OtherDeduction: any = 0;
  MLWF: any = 0;
  PT: any = 0;
  EPFEmployee: any = 0;
  ESICEmployee: any = 0;
  EPFEmployer: any = 0;
  ESICEmployer: any = 0;
  TotalEarning: any = 0;
  HRA: any = 0;
  OtherAllowance: any = 0;
  SpecialAllowance: any = 0;
  gender: any;
  calculateSalary() {
    if (this.manualCalculation) {
      this.HRA = Math.round(this.getPerc(this.BASIC + this.DA, 100 - 5));
      this.EPFEmployee = Math.round(
        this.getPerc(this.BASIC + this.DA, 100 - 12)
      );
      this.EPFEmployer = Math.round(
        this.getPerc(this.BASIC + this.DA, 100 - 13)
      );
      this.TotalEarning = Math.round(
        this.HRA +
          this.BASIC +
          this.DA +
          this.SpecialAllowance +
          this.OtherAllowance
      );
      if (this.gender == "female") {
        this.PT = this.TotalEarning > 10000 ? 200 : 0;
      } else if (this.gender == "male") {
        this.PT =
          this.TotalEarning > 10000 ? 200 : this.TotalEarning > 7500 ? 175 : 0;
      } else {
        this.PT =
          this.TotalEarning > 10000 ? 200 : this.TotalEarning > 7500 ? 175 : 0;
      }
      this.ESICEmployee = Math.round(
        this.getPerc(this.TotalEarning, 100 - 0.75)
      );
      this.ESICEmployer = Math.round(
        this.getPerc(this.TotalEarning, 100 - 3.25)
      );
      this.TotalDeduction = Math.round(
        this.EPFEmployee +
          this.EPFEmployer +
          this.ESICEmployee +
          this.ESICEmployer +
          this.PT +
          this.MLWF +
          this.OtherDeduction
      );
      this.NetTotal = Math.round(this.TotalEarning - this.TotalDeduction);
    }
  }

  getPerc(num, percent) {
    return Number(num) - (Number(percent) / 100) * Number(num);
  }
  /**
   * calculation - end
   */
}
