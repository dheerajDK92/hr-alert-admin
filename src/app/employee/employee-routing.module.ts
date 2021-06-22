import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { employeePage } from './employee.page';

const routes: Routes = [
  {
    path: '',
    component: employeePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class employeePageRoutingModule {}
