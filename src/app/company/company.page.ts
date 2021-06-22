import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, NavigationExtras } from "@angular/router";
import {
  IonInfiniteScroll,
  NavParams,
  NavController,
  ModalController,
} from "@ionic/angular";
import { HttpClient } from "@angular/common/http";
import { CompanyService } from "../common/service/company.service";
import { ToastService } from "../common/service/toast.service";
import { isNullOrUndefined } from "util";
import { AddLogoComponent } from "./component/add-logo/add-logo.component";
import { environment } from "./../../environments/environment";
import { LoaderService } from "../common/service/loder.service";
import { UploadSalaryMonthlyComponent } from "./component/upload-salary-monthly/upload-salary-monthly.component";
@Component({
  selector: "app-company",
  templateUrl: "./company.page.html",
  styleUrls: ["./company.page.scss"],
})
export class companyPage implements OnInit {
  public main: string;
  skelenton = true;
  cmpList = [];
  activeScreen: string = "main";
  selectedCompanyDetail: any;
  // logoURL = environment
  constructor(
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    private navParams: NavParams,
    private _http: HttpClient,
    private _company: CompanyService,
    private _toast: ToastService,
    private modalController: ModalController,
    private _loader: LoaderService
  ) {}
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  ngOnInit() {
    this._loader.showLoader();
    this.main = this.activatedRoute.snapshot.paramMap.get("id");
    // TODO: need to add api to load employee List Meanwhile we are showing skeleton as api dummy
    this.getcmpList(null);
  }

  openPage(id: any) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        empId: JSON.stringify(id),
      },
    };
    this.navCtrl.navigateForward("main/Home", navigationExtras);
  }
  getcmpList(event) {
    this.skelenton = true;
    setTimeout(() => {
      this._company.getCompany().subscribe(
        (response: any) => {
          this.skelenton = false;
          if (event) event.target.complete();
          if (isNullOrUndefined(response.error)) {
            this.cmpList = response.data.companies;
          } else {
            this._toast.showWarning("Something Went Wrong. Please try again");
          }
        },
        (err) => {
          this.skelenton = false;
          if (event) event.target.complete();
          this._toast.showWarning(err.error.error);
        }
      );
    }, 1000);
  }

  loadAddCompany() {
    this.activeScreen = "addCompany";
  }

  loadMain(event) {
    this.activeScreen = "main";
    if (event) {
      this.ngOnInit();
    }
  }
  loadScreen(company, screenName) {
    this._loader.showLoader();
    console.log("screenName", screenName);
    if (screenName == "manageScreen") {
      this.activeScreen = "manageCompany";
    } else if (screenName == "Attendance") {
      this.activeScreen = "Attendance";
    } else if (screenName == "Report") {
      this.activeScreen = "Report";
    } else if (screenName == "siteQR") {
      this.activeScreen = "siteQR";
    } else if (screenName == "manualPunch") {
      this.activeScreen = "manualPunch";
    } else if (screenName == "todayWorkForce") {
      this.activeScreen = "todayWorkForce";
    } else if (screenName == "generateSalarySlip") {
      this.activeScreen = "generateSalarySlip";
    } else if (screenName == "assets") {
      this.activeScreen = "assets";
    }
    // else if(screenName == "Leave"){
    //   this.activeScreen = "Leave";
    // }else if(screenName == "Reimburse"){
    //   this.activeScreen = "Reimburse";
    // }else if(screenName == "Advance"){
    //   this.activeScreen = "Advance";
    // }
    this.selectedCompanyDetail = company;
  }

  async changeLogo(data2) {
    const modal = await this.modalController.create({
      component: AddLogoComponent,
      cssClass: "addLogoPage",
      componentProps: {
        empData: data2,
        uploadFor: "Company",
      },
    });

    modal.onDidDismiss().then((data) => {
      if (!isNullOrUndefined(data.data)) {
        if (isNullOrUndefined(data.data.uploaded)) {
          this.ngOnInit();
        }
      }
    });

    return await modal.present();
  }
  /**
   * uploadMonthlySalarySlips
   */
  async uploadMonthlySalarySlips(companyDetail){
    console.log("companyDetail ===>", companyDetail);
    const modal = await this.modalController.create({
      component: UploadSalaryMonthlyComponent,
      componentProps: {
        cmpData: companyDetail,
        uploadFor: "Company",
      },
    });

    modal.onDidDismiss().then((data) => {
      if (!isNullOrUndefined(data.data)) {
        if (isNullOrUndefined(data.data.uploaded)) {
          this.ngOnInit();
        }
      }
    });

    return await modal.present();
  }
}
