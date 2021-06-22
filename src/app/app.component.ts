import { Component, OnInit, OnDestroy } from "@angular/core";
import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { AuthenticationService } from "./common/service/authentication.service";
import { isNullOrUndefined } from "util";
import { environment } from "../environments/environment";
import { Router, RouterEvent } from "@angular/router";
import { Subscription, Observable, fromEvent } from "rxjs";
import { ToastService } from "./common/service/toast.service";
import { AlertController } from "@ionic/angular";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent implements OnInit, OnDestroy {
  appName = environment.Appname;
  private hrEmail = environment.hrEmail;
  public selectedIndex = 0;
  public selectedIndexInfo = null;
  public selectedIndexReports = null;
  public selectedIndexOthers = null;
  public selectedIndexUnAuth = null;
  public isLoggedIn = false;
  public appRefresh = true;
  subscriptions: Subscription[] = [];
  onlineEvent: Observable<Event>;
  offlineEvent: Observable<Event>;
  offLine: boolean = false;
  selectedPath = "";
  isAdminValid = false;
  public appPages = [
    {
      title: "Home",
      url: "/main/Home",
      icon: "home",
    },
  ];

  public appInfoPages = [
    {
      title: "Company",
      url: "/company/Company",
      icon: "people",
    },
    {
      title: "Clean Deleted Company Employee",
      url: "/employee-delete",
      icon: "people",
    },
  ];
  public appInfoOthers = [
    {
      title: "About",
      url: "/about/About",
      icon: "location",
    },
    {
      title: "Feedback",
      url: "/feedback/Feedback",
      icon: "newspaper",
    },
  ];
  public appUnAuthPages = [
    {
      title: "Login",
      url: "/login",
      icon: "person",
    },
  ];
  public labels = ["Family", "Friends", "Notes", "Work", "Travel", "Reminders"];
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private _auth: AuthenticationService,
    private router: Router,
    private _toast: ToastService,
    private alertController: AlertController
  ) {
    this.initializeApp();
  }
  async validateConfirm() {
    const alert = await this.alertController.create({
      header: "Enter Site Username/Password",
      buttons: [
        {
          text: "Submit",
          handler: (data) => {
            if (
              data.Username == environment.adminUser &&
              data.Password == environment.adminPass
            ) {
              this.isAdminValid = true;
            } else {
              this._toast.showWarning("Unauthorized Admin Details!");
              this.isAdminValid = false;
              setTimeout(() => {
                location.reload();
              }, 1000);
            }
          },
        },
      ],
      inputs: [
        {
          name: "Username",
          placeholder: "Username...",
        },
        {
          name: "Password",
          placeholder: "Password...",
        },
      ],
      cssClass: "alertstar",
      backdropDismiss: false,
    });
    await alert.present();
  }

  reloadScreen() {
    this.appRefresh = false;
    setTimeout(() => {
      this.appRefresh = true;
    }, 1000);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.router.events.subscribe((event: RouterEvent) => {
        if (event && event.url) {
          this.selectedPath = event.url;
        }
        this.checkLoginStatus();
      });

      this._auth.authenticateionState.subscribe((state) => {
        this.reloadScreen(); // TODO need to remove during PROD deployment
        if (state) {
          this.router.navigate(["/main/Home"]);
          this.isLoggedIn = true;
          this.isAdminValid = true;
        } else {
          environment.activateAdminLoginPopUp
          ? this.validateConfirm()
          : (this.isAdminValid = true);
          this.router.navigate(["/login"]);
        }
      });

      this._auth.checkToken();

      this.onlineEvent = fromEvent(window, "online");
      this.offlineEvent = fromEvent(window, "offline");
      this.subscriptions.push(
        this.onlineEvent.subscribe((e) => {
          this._toast.showWarning(`Back To Internet.`);
          this.offLine = false;
          console.log("Online...");
        })
      );

      this.subscriptions.push(
        this.offlineEvent.subscribe((e) => {
          this._toast.showWarning(`You are disconnected from Internet.`);
          this.offLine = true;
          console.log("Offline...");
        })
      );
    });
  }

  ngOnInit() {
    const path = window.location.pathname.split("main/")[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(
        (page) => page.title.toLowerCase() === path.toLowerCase()
      );
    }
  }

  checkLoginStatus() {
    this.isLoggedIn = this._auth.isAuthenticated();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
