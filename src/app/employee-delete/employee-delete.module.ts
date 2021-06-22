import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmployeeDeletePageRoutingModule } from './employee-delete-routing.module';
import { CommonPageModule } from "./../common/common.module";
import { EmployeeDeletePage } from './employee-delete.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmployeeDeletePageRoutingModule,
    CommonPageModule
  ],
  declarations: [EmployeeDeletePage]
})
export class EmployeeDeletePageModule {}
