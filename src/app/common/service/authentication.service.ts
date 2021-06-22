import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { map } from "rxjs/operators";
import { Storage } from "@ionic/storage";
import { Platform } from "@ionic/angular";
import { ApiUrlService } from "./api-url.service";

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  authenticateionState = new BehaviorSubject(false);
  token: any = null;
  constructor(
    private http: HttpClient,
    private storage: Storage,
    private plt: Platform,
    private apiRUL: ApiUrlService
  ) {
    this.plt.ready().then(() => {
      // this.logout();
      this.checkToken();
    });
  }

  isAuthenticated(): any {
    return this.authenticateionState.value;
  }
  // Login Method
  login(data) {
    const url = this.apiRUL.getUrl("adminLogin");
    return this.http.post(url, data);
  }
  // set token
  setloginToken(token) {
    this.token = token;
    return this.storage.set(environment.TOKEN_KEY, token).then((res) => {
      this.authenticateionState.next(true);
    });
  }
  // get token
  getloginToken() {
    return this.storage.get(environment.TOKEN_KEY).then((token) => {
      if (token) {
        this.authenticateionState.next(true);
      }
    });
  }
  // logout token
  logout() {
    this.token = null;
    return this.storage.remove(environment.TOKEN_KEY).then((res) => {
      this.authenticateionState.next(false);
    });
  }
  // Check Token after Refresh
  checkToken() {
    return this.storage.get(environment.TOKEN_KEY).then((res) => {
      if (res) {
        this.token = res;
        this.authenticateionState.next(true);
      }
    });
  }
}
