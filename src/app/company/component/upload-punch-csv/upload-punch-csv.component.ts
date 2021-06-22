import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { ApiUrlService } from "src/app/common/service/api-url.service";
import { ToastService } from "src/app/common/service/toast.service";
import { EmployeeService } from "src/app/common/service/employee.service";
import { isNullOrUndefined } from "util";

@Component({
  selector: "app-upload-punch-csv",
  templateUrl: "./upload-punch-csv.component.html",
  styleUrls: ["./upload-punch-csv.component.scss"],
})
export class UploadCSVPunchComponent implements OnInit {
  title = "Upload Employee's Punch CSV";
  companyData: any;
  apiURL: any;
  companyDetails: any;
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
          let FinalEmpPunchData = [];
          for (let i = 0; i < csvData.length - 1; i++) {
            if (i != 0) {
              console.log("csvData[i] ==> ", csvData[i]);
              const filledData = this.filteredEnteredData(csvData[i]);
              FinalEmpPunchData.push(filledData);
            }
          }
          // Remove First 2 index as those are not required while submitting
          FinalEmpPunchData.shift();
          FinalEmpPunchData.shift();
          console.log("FinalEmpPunchData ===>", FinalEmpPunchData);

          const UpdatedEntryAfterCleanUp = this.RemoveEmptyFieldData(
            FinalEmpPunchData
          );
          console.log(
            "UpdatedEntryAfterCleanUp ===>",
            UpdatedEntryAfterCleanUp
          );
          const validData = this.validateEnteredData(UpdatedEntryAfterCleanUp);
          console.log("validData ===>", validData);

          if (validData) {
            this._emp
              .startMultiplePunch({ data: UpdatedEntryAfterCleanUp })
              .subscribe(
                (response: any) => {
                  console.log("response", response);
                  if (isNullOrUndefined(response.error)) {
                    console.log("response", response);
                    this._toast.showWarning(
                      "Successfully punched for selected employee's."
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
      console.log("itm ==>", itm);
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

  filteredEnteredData(data) {
    console.log("this.companyDetails", this.companyDetails)
    const employee = data.split(",");
    let returnEmp: any = {};
    returnEmp._id = employee[0];
    returnEmp.empname = employee[1];
    returnEmp.Site = employee[2];
    returnEmp.punchDateSelected = employee[3];
    returnEmp.punchStartTime = employee[4];
    returnEmp.punchStopTime = employee[5];
    returnEmp.companyId = this.companyDetails._id;
    return returnEmp;
  }

  cancelPopUp() {
    this.modalController.dismiss();
  }
}
