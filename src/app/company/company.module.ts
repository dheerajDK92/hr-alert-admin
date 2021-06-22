import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { companyPageRoutingModule } from "./company-routing.module";
import { companyPage } from "./company.page";
import { CommonPageModule } from "../common/common.module";
import { AddCompanyComponent } from "./component/add-company/add-company.component";
import { ManageCompanyComponent } from "./component/manage-company/manage-company.component";
import { CompanyProfileComponent } from "./component/company-profile/company-profile.component";
import { EmployeeListComponent } from "./component/employee-list/employee-list.component";
import { AddEmployeeComponent } from "./component/add-employee/add-employee.component";
import { UpdateEmployeeComponent } from "./component/update-employee/update-employee.component";
import { AddLogoComponent } from "./component/add-logo/add-logo.component";
import { FileUploadModule } from "ng2-file-upload";
import { UploadCSVComponent } from "./component/upload-csv/upload-csv.component";
import { ProofStatusComponent } from "./component/proof-status/proof-status.component";
import { EmployeeReportComponent } from "./component/employee-report/employee-report.component";
import { siteQRComponent } from "./component/siteQR/siteQR.component";
import { manualPunchComponent } from "./component/manualPunch/manualPunch.component";
import { UploadCSVPunchComponent } from "./component/upload-punch-csv/upload-punch-csv.component";
import { TodayWorkForceComponent } from "./component/today-workforce/today-workforce.component";
import { GenerateSalarySlipComponent } from "./component/generate-salary-slip/generate-salary-slip.component";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { AssetsComponent } from "./component/assests/assests.component";
import { EmployeeIDComponent } from "./component/employee-id/employee-id.component";
import { NgxQRCodeModule } from "@techiediaries/ngx-qrcode";
import { UploadSalaryMonthlyComponent } from "./component/upload-salary-monthly/upload-salary-monthly.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    companyPageRoutingModule,
    CommonPageModule,
    FileUploadModule,
    NgxDatatableModule,
    NgxQRCodeModule,
  ],
  declarations: [
    companyPage,
    AddCompanyComponent,
    ManageCompanyComponent,
    CompanyProfileComponent,
    EmployeeListComponent,
    AddEmployeeComponent,
    UpdateEmployeeComponent,
    AddLogoComponent,
    UploadCSVComponent,
    ProofStatusComponent,
    UploadCSVPunchComponent,
    EmployeeReportComponent,
    siteQRComponent,
    manualPunchComponent,
    TodayWorkForceComponent,
    GenerateSalarySlipComponent,
    AssetsComponent,
    UploadSalaryMonthlyComponent,
    EmployeeIDComponent,
  ],
})
export class companyPageModule {}
