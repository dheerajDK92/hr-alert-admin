import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { feedbackPageRoutingModule } from './feedback-routing.module';

import { feedbackPage } from './feedback.page';
import { CommonPageModule } from '../common/common.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    feedbackPageRoutingModule,
    CommonPageModule
  ],
  declarations: [feedbackPage]
})
export class feedbackPageModule {}
