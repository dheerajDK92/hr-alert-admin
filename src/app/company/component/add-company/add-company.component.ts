import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { CompanyService } from "src/app/common/service/company.service";
import { isNullOrUndefined } from "util";
import { ToastService } from "src/app/common/service/toast.service";

@Component({
  selector: "app-add-company",
  templateUrl: "./add-company.component.html",
  styleUrls: ["./add-company.component.scss"],
})
export class AddCompanyComponent implements OnInit {
  constructor(private _com: CompanyService, private _toast: ToastService) {}
  @Output() public successFullyRegister = new EventEmitter();
  ngOnInit() {}
  submitAddCompanyForm(form) {
    const submittedData = form.form.value;
    submittedData.phone = String(submittedData.phone);
    submittedData.country = String("India");
    this._com.registerCompany(submittedData).subscribe(
      (response: any) => {
        console.log("response ===>", response);
        if (isNullOrUndefined(response.error)) {
          this.successFullyRegister.emit("true");
          this._toast.showWarning("Successfully Company Added");
        } else {
          this._toast.showWarning("Something Went Wrong. Please try again");
        }
      },
      (err) => {
        this._toast.showWarning(err.error.error);
      }
    );
    console.log("submittedData ===>", submittedData);
  }

  backToMain(){
    this.successFullyRegister.emit("true");
  }
}
