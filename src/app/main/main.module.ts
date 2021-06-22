import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { mainPageRoutingModule } from './main-routing.module';

import { mainPage } from './main.page';
import { CommonPageModule } from '../common/common.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    mainPageRoutingModule,
    CommonPageModule
  ],
  declarations: [mainPage]
})
export class mainPageModule {}
