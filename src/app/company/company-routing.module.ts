import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { companyPage } from './company.page';
import { AddCompanyComponent } from './component/add-company/add-company.component';

const routes: Routes = [
  {
    path: '',
    component: companyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class companyPageRoutingModule {}
