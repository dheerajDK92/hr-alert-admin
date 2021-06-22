import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { employeePageRoutingModule } from "./employee-routing.module";
import { employeePage } from "./employee.page";
import { CommonPageModule } from "../common/common.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    employeePageRoutingModule,
    CommonPageModule,
  ],
  declarations: [employeePage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class employeePageModule {}
