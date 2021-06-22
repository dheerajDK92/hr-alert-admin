import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, NavigationExtras } from "@angular/router";
import { IonInfiniteScroll, NavController, NavParams } from "@ionic/angular";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-employee",
  templateUrl: "./employee.page.html",
  styleUrls: ["./employee.page.scss"],
})
export class employeePage implements OnInit {
  public main: string;
  skelenton = true;
  empList = [];
  constructor(
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    private navParams: NavParams,
    private _http: HttpClient
  ) {}
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  ngOnInit() {
    this.main = this.activatedRoute.snapshot.paramMap.get("id");
    // TODO: need to add api to load employee List Meanwhile we are showing skeleton as api dummy
    setTimeout(() => {
      this.skelenton = false;
    }, 3000);
  }

  openPage(id: any) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        empId: JSON.stringify(id),
      },
    };
    this.navCtrl.navigateForward("main/Home", navigationExtras);
  }
}
