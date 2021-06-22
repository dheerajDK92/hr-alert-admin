import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { feedbackPage } from './feedback.page';

const routes: Routes = [
  {
    path: '',
    component: feedbackPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class feedbackPageRoutingModule {}
