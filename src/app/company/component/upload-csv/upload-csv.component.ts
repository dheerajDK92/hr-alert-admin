import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { ApiUrlService } from "src/app/common/service/api-url.service";
import { ToastService } from "src/app/common/service/toast.service";
import { EmployeeService } from "src/app/common/service/employee.service";
import { isNullOrUndefined } from "util";

@Component({
  selector: "app-upload-csv",
  templateUrl: "./upload-csv.component.html",
  styleUrls: ["./upload-csv.component.scss"],
})
export class UploadCSVComponent implements OnInit {
  title = "Upload Employee's";
  companyData: any;
  apiURL: any;
  constructor(
    private modalController: ModalController,
    private _apiURL: ApiUrlService,
    private _toast: ToastService,
    private _emp: EmployeeService
  ) {}

  ngOnInit() {
    // Defined the Array Chunks
    Object.defineProperty(Array.prototype, "chunkArray", {
      value: function (chunkSize) {
        var R = [];
        for (var i = 0; i < this.length; i += chunkSize)
          R.push(this.slice(i, i + chunkSize));
        return R;
      },
    });
  }

  fileChangeListener(files: FileList) {
    if (files && files.length > 0) {
      let file: File = files.item(0);
      if (String(file.name).substr(file.name.length - 3) == "csv") {
        let reader: FileReader = new FileReader();
        reader.readAsText(file);
        reader.onload = (e) => {
          let csv: any = reader.result as string;
          // const csvData = csv.split(',').chunkArray(12);
          const csvData = csv.split("\n");
          let FinalEmpData = [];
          for (let i = 0; i < csvData.length - 1; i++) {
            if (i != 0) {
              console.log("csvData[i] ==> ", csvData[i]);
              const filledData = this.filteredEnteredData(csvData[i]);
              FinalEmpData.push(filledData);
            }
          }
          console.log("FinalEmpData ===>", FinalEmpData);
          const UpdatedEntryAfterCleanUp = this.RemoveEmptyFieldData(
            FinalEmpData
          );
          const validData = this.validateEnteredData(UpdatedEntryAfterCleanUp);
          console.log(
            "UpdatedEntryAfterCleanUp ===>",
            UpdatedEntryAfterCleanUp
          );

          if (validData) {
            if (this.companyData.EmpLimit >= UpdatedEntryAfterCleanUp.length) {
              this._emp
                .registerMultipleEmployee(UpdatedEntryAfterCleanUp)
                .subscribe(
                  (response: any) => {
                    if (isNullOrUndefined(response.error)) {
                      let array = response.message;
                      let errorMessage = ``;
                      for (const iterator of array) {
                        if (iterator.error) {
                          errorMessage += `(${iterator.email}, ${iterator.phone}, ${iterator.empID})`;
                        }
                      }
                      if (errorMessage == "") {
                        this._toast.showWarning("Successfully Employee Added!");
                      } else {
                        this._toast.showError(
                          "Some Issue is with " +
                            errorMessage +
                            " Please try with other data"
                        );
                      }
                    } else {
                      this._toast.showWarning(
                        "Something Went Wrong. Please try again"
                      );
                    }
                    this.modalController.dismiss({ done: true });
                  },
                  (err) => {
                    this._toast.showWarning(err.error.error);
                  }
                );
            } else {
              this._toast.showWarning(
                "Please Contract With Your Adminidtrator. Your Limit Is Less To Upload Employee's"
              );
            }
          }
        };
      } else {
        this._toast.showError("Please select .csv file format.");
      }
    }
  }

  RemoveEmptyFieldData(data) {
    let output = [];
    for (let itm of data) {
      if (
        this.isNullEmpty(itm.empID) ||
        this.isNullEmpty(itm.empname) ||
        this.isNullEmpty(itm.email) ||
        this.isNullEmpty(itm.password) ||
        this.isNullEmpty(itm.Site)
      ) {
        //
      } else {
        output.push(itm);
      }
    }
    return output;
  }

  isNullEmpty(value) {
    return value == "" || value == null || value == undefined;
  }

  validateEnteredData(formData) {
    let output = true;
    let count = 1;
    // Empty Field Validation
    for (let itm of formData) {
      if (
        this.isNullEmpty(itm.empID) ||
        this.isNullEmpty(itm.empname) ||
        this.isNullEmpty(itm.email) ||
        this.isNullEmpty(itm.password) ||
        this.isNullEmpty(itm.Site)
      ) {
        let msg = "Please enter/select";
        this.isNullEmpty(itm.empID) ? (msg += " `Employment ID`") : "";
        this.isNullEmpty(itm.empname) ? (msg += " `Employment Name`") : "";
        this.isNullEmpty(itm.email) ? (msg += " `Employment Email`") : "";
        this.isNullEmpty(itm.password) ? (msg += " `Employment Password`") : "";
        this.isNullEmpty(itm.Site) ? (msg += " `Site`") : "";
        this._toast.showError(msg + `at row ${count}`);
        output = false;
      }
      count++;
    }

    return output;
  }

  filteredEnteredData(data) {
    const employee = data.split(",");
    let returnEmp: any = {};
    returnEmp.empname = employee[0];
    returnEmp.empID = employee[1];
    returnEmp.Site = employee[2];
    returnEmp.phone = employee[3];
    returnEmp.email = employee[4];
    returnEmp.password = employee[5];
    returnEmp.designation = employee[6];
    returnEmp.address = employee[7];
    returnEmp.pincode = employee[8];
    returnEmp.city = employee[9];
    returnEmp.state = employee[10];
    returnEmp.country = employee[11];
    returnEmp.PAN = employee[12];
    returnEmp.Aadhaar = Number(employee[13]);
    returnEmp.IFSC = employee[14];
    returnEmp.BankName = employee[15];
    returnEmp.AccountNumber = employee[16];
    returnEmp.Basic = Number(employee[17]);
    returnEmp.DA = Number(employee[18]);
    returnEmp.SpecialAllowance = Number(employee[19]);
    returnEmp.OtherAllowance = Number(employee[20]);
    returnEmp.HRA = Number(employee[21]);
    returnEmp.TotalEarning = Number(employee[22]);
    returnEmp.ESICEmployer = Number(employee[23]);
    returnEmp.EPFEmployer = Number(employee[24]);
    returnEmp.ESICEmployee = Number(employee[25]);
    returnEmp.EPFEmployee = Number(employee[26]);
    returnEmp.PT = Number(employee[27]);
    returnEmp.MLWF = Number(employee[28]);
    returnEmp.OtherDeduction = Number(employee[29]);
    returnEmp.TotalDeduction = Number(employee[30]);
    returnEmp.NetTotal = Number(employee[31]);
    returnEmp.DOB = "",
    returnEmp.DOJ = "",
    returnEmp.DOL = "",
    returnEmp.gender = "",
    returnEmp.isHrAdmin = false,
    returnEmp.isMonthlyCalculation = true,
    returnEmp.isReportingManager = false,
    returnEmp.companyId = this.companyData._id,
    returnEmp.address2 = "",
    returnEmp.description = "",
    returnEmp.startTime = "";
    returnEmp.endtTime = "";
    returnEmp.halfDayApplicable = false,
    returnEmp.minHoursOfHalfDay = false,
    returnEmp.maxHoursOfContinousWork = "";
    returnEmp.weeklyOffs = [], 
    returnEmp.selfAttendanceMethod = "";
    returnEmp.attendanceFromOffice = false;
    returnEmp.imageWithAttendance = false;
    returnEmp.overTimeApplicable = false;
    returnEmp.paymentType = "";
    return returnEmp;
  }

  cancelPopUp() {
    this.modalController.dismiss();
  }
}
