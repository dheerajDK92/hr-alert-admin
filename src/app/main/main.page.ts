import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, RouterState } from "@angular/router";
import { Route } from "@angular/compiler/src/core";
import { DashboardService } from "../common/service/dashboard.service";
import { ToastService } from "../common/service/toast.service";
import { LoaderService } from "../common/service/loder.service";

@Component({
  selector: "app-main",
  templateUrl: "./main.page.html",
  styleUrls: ["./main.page.scss"],
})
export class mainPage implements OnInit {
  public main: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private dashboard: DashboardService,
    private _toast: ToastService,
    private _loader: LoaderService
  ) {}

  ngOnInit() {
    this._loader.showLoader();
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params && params.empId) {
        console.log("State ===>", JSON.parse(params.empId));
      }
    });
    this.main = this.activatedRoute.snapshot.paramMap.get("id");
    this.loadDashboard();
  }

  loadDashboard() {
    this.dashboard.getDashboardDetails().subscribe(
      (response) => {
        console.log("response ===>", response);
      },
      (err) => {
        this._toast.showWarning(err.error.error);
      }
    );
  }
}
