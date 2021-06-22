import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { HeaderComponent } from "./component/header/header.component";
import { AuthGuardService } from "./service/auth-guard.service";
import { AuthenticationService } from "./service/authentication.service";
import { MorePopOverComponent } from "./component/more-pop-over/more-pop-over.component";
import { SkeletonComponent } from "./component/skeleton/skeleton.component";
import { CompanySkeletonComponent } from "./component/company-skeleton/company-skeleton.component";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule],
  providers: [AuthGuardService, AuthenticationService],
  exports: [
    HeaderComponent,
    MorePopOverComponent,
    SkeletonComponent,
    CompanySkeletonComponent,
  ],
  declarations: [
    HeaderComponent,
    MorePopOverComponent,
    SkeletonComponent,
    CompanySkeletonComponent,
  ],
  entryComponents: [
    MorePopOverComponent,
    SkeletonComponent,
    CompanySkeletonComponent,
  ],
})
export class CommonPageModule {}
