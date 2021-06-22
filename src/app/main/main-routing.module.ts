import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { mainPage } from './main.page';

const routes: Routes = [
  {
    path: '',
    component: mainPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class mainPageRoutingModule {}
