import { Injectable } from '@angular/core';
import { ApiUrlService } from './api-url.service';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private apiKey: ApiUrlService, private _auth: AuthenticationService, private _http: HttpClient) { }

  getDashboardDetails(){
    const dashboardURL = this.apiKey.getUrl("adminDashboard");
    return this._http.get(dashboardURL);
  }
}
