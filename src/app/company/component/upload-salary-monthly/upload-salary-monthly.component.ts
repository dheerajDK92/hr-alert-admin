import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { ApiUrlService } from "src/app/common/service/api-url.service";
import { ToastService } from "src/app/common/service/toast.service";
import { EmployeeService } from "src/app/common/service/employee.service";
import { isNullOrUndefined } from "util";

@Component({
  selector: "app-upload-salary-monthly",
  templateUrl: "./upload-salary-monthly.component.html",
  styleUrls: ["./upload-salary-monthly.component.scss"],
})
export class UploadSalaryMonthlyComponent implements OnInit {
  title = "Upload Employee's Monthly Salary";
  cmpData: any;
  apiURL: any;
  companyDetails: any;
  month: any;
  constructor(
    private modalController: ModalController,
    private _apiURL: ApiUrlService,
    private _toast: ToastService,
    private _emp: EmployeeService
  ) {}

  ngOnInit() {
    console.log("cmpData ===>", this.cmpData);
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
          let FinalEmpPunchData = [];
          for (let i = 0; i < csvData.length - 1; i++) {
            if (i != 0) {
              console.log("csvData[i] ==> ", csvData[i]);
              const filledData = this.filteredEnteredData(csvData[i]);
              FinalEmpPunchData.push(filledData);
            }
          }
          // // Remove First 2 index as those are not required while submitting
          // FinalEmpPunchData.shift();
          // FinalEmpPunchData.shift();
          // console.log("FinalEmpPunchData ===>", FinalEmpPunchData);
          // console.log("month ===>", this.month);

          // const UpdatedEntryAfterCleanUp = this.RemoveEmptyFieldData(
          //   FinalEmpPunchData
          // );
          // console.log(
          //   "UpdatedEntryAfterCleanUp ===>",
          //   UpdatedEntryAfterCleanUp
          // );
          // const validData = this.validateEnteredData(UpdatedEntryAfterCleanUp);
          // console.log("validData ===>", validData);

          if (true) {
            console.log("FinalEmpPunchData ===>", FinalEmpPunchData);
            this._emp
              .startMultipleSalaryUpload({ data: FinalEmpPunchData })
              .subscribe(
                (response: any) => {
                  console.log("response", response);
                  if (response.error.length == 0) {
                    console.log("response", response);
                    this._toast.showWarning(
                      `Successfully Salary Slips Uploaded for ${FinalEmpPunchData[0].month}`
                    );
                    this.modalController.dismiss({ done: true });
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
        this.isNullEmpty(itm._id) ||
        this.isNullEmpty(itm.empname) ||
        this.isNullEmpty(itm.Site) ||
        this.isNullEmpty(itm.punchDateSelected) ||
        this.isNullEmpty(itm.punchStartTime) ||
        this.isNullEmpty(itm.punchStopTime)
      ) {
        //
      } else {
        output.push(itm);
      }
    }
    console.log("output ===>", output);
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
        this.isNullEmpty(itm._id) ||
        this.isNullEmpty(itm.empname) ||
        this.isNullEmpty(itm.Site) ||
        this.isNullEmpty(itm.punchDateSelected) ||
        this.isNullEmpty(itm.punchStartTime) ||
        this.isNullEmpty(itm.punchStopTime)
      ) {
        let msg = "Please enter/select";
        this.isNullEmpty(itm._id) ? (msg += " `Employment ID`") : "";
        this.isNullEmpty(itm.empname) ? (msg += " `Employment Name`") : "";
        this.isNullEmpty(itm.Site) ? (msg += " `Employment Site`") : "";
        this.isNullEmpty(itm.punchDateSelected)
          ? (msg += " `Employment Punch Date`")
          : "";
        this.isNullEmpty(itm.punchStartTime)
          ? (msg += " `Employment Start Time`")
          : "";
        this.isNullEmpty(itm.punchStopTime)
          ? (msg += " `Employment Stop Time`")
          : "";
        this._toast.showError(msg + `at row ${count}`);
        output = false;
      }
      count++;
    }
    return output;
  }
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

  filteredEnteredData(data) {
    const employee = data.split(",");
    let returnEmp: any = {};
    returnEmp.month= `${
      this.monthNames[new Date(this.month).getMonth()]
    }-${new Date(this.month).getFullYear()}`;
    returnEmp.empName= `${employee[2]}`;
    returnEmp.employeeId=`${employee[1]}`;
    returnEmp.SpecialAllowance=`${employee[1]}`;
    returnEmp.OtherAllowance=`${employee[1]}`;
    returnEmp.GROSSFIXED=`${employee[3]}`;
    returnEmp.paidDays=`${employee[4]}`;
    returnEmp.BASIC=`${employee[5]}`;
    returnEmp.DA=`${employee[6]}`;
    returnEmp.HRA=`${employee[7]}`;
    returnEmp.ConvAll=`${employee[8]}`;
    returnEmp.ProdIncentive=`${employee[9]}`;
    returnEmp.OtherEarning=`${employee[10]}`;
    returnEmp.WashAll=`${employee[11]}`;
    returnEmp.GROSSEARNING=`${employee[12]}`;
    returnEmp.PF=`${employee[13]}`;
    returnEmp.PTAX=`${employee[14]}`;
    returnEmp.ESICEmployee=`${employee[15]}`;
    returnEmp.MLWF=`${employee[16]}`;
    returnEmp.LoanDeduction=`${employee[17]}`;
    returnEmp.AdvDeduction=`${employee[18]}`;
    returnEmp.OtherDeduction=`${employee[19]}`;
    returnEmp.GROSSDEDUCION=`${employee[20]}`;
    returnEmp.NETEARNING=`${employee[21]}`;
    returnEmp.CHEQUE=`${employee[22]}`;
    returnEmp.SITE=`${employee[23]}`;
    returnEmp.companyId= `${this.cmpData._id}`;
    return returnEmp;
  }

  cancelPopUp() {
    this.modalController.dismiss();
  }
}
