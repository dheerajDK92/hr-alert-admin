import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmployeeDeletePage } from './employee-delete.page';

const routes: Routes = [
  {
    path: '',
    component: EmployeeDeletePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeeDeletePageRoutingModule {}
