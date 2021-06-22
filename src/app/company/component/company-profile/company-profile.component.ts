import { Component, OnInit, Input, OnChanges } from "@angular/core";
import { CompanyService } from "src/app/common/service/company.service";
import { isNullOrUndefined } from "util";
import { ToastService } from "src/app/common/service/toast.service";

@Component({
  selector: "app-company-profile",
  templateUrl: "./company-profile.component.html",
  styleUrls: ["./company-profile.component.scss"],
})
export class CompanyProfileComponent implements OnInit, OnChanges {
  constructor(private _com: CompanyService, private _toast: ToastService) {}
  @Input("companydata") companydata: any;
  disabledUpdateField = true;
  ngOnInit() {}

  submitUpdateCompanyForm(form) {
    const submittedData = form.form.value;
    submittedData.phone = String(submittedData.phone);
    submittedData.country = String("India");
    submittedData.companyName = this.companydata.companyName;
    submittedData._id = this.companydata._id;
    this._com.updateCompany(submittedData).subscribe(
      (response: any) => {
        if (isNullOrUndefined(response.error)) {
          this.disabledUpdateField = true;
          this.companydata = response.data.updatedCompanyData;
          this._toast.showWarning("Successfully Company Updated");
        } else {
          this._toast.showWarning("Something Went Wrong. Please try again");
        }
      },
      (err) => {
        this._toast.showWarning(err.error.error);
      }
    );
  }

  ngOnChanges(changes: any) {
    if (changes.companydata) {
      this.companydata = changes.companydata.currentValue;
    }
  }

  updateToggleChange(event) {
    event.detail.checked
      ? (this.disabledUpdateField = false)
      : (this.disabledUpdateField = true);
  }
}
