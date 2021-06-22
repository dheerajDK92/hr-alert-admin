import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { AuthGuardService } from "./common/service/auth-guard.service";

const routes: Routes = [
  {
    path: "",
    component: LoginComponent,
  },
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "main/:id",
    loadChildren: () =>
      import("./main/main.module").then((m) => m.mainPageModule),
    canActivate: [AuthGuardService],
  },
  {
    path: "employee/:id",
    loadChildren: () =>
      import("./employee/employee.module").then((m) => m.employeePageModule),
    canActivate: [AuthGuardService],
  },
  {
    path: "company/:id",
    loadChildren: () =>
      import("./company/company.module").then((m) => m.companyPageModule),
    canActivate: [AuthGuardService],
  },
  {
    path: "feedback/:id",
    loadChildren: () =>
      import("./feedback/feedback.module").then((m) => m.feedbackPageModule),
    canActivate: [AuthGuardService],
  },
  {
    path: 'employee-delete',
    canActivate: [AuthGuardService],
    loadChildren: () => import('./employee-delete/employee-delete.module').then( m => m.EmployeeDeletePageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
