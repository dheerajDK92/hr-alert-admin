import { Injectable } from "@angular/core";
import { ApiUrlService } from "./api-url.service";
import { HttpClient } from "@angular/common/http";
import { isNullOrUndefined }  from "js_utility_fns";

@Injectable({
  providedIn: "root",
})
export class AssetService {
  constructor(private apiRUL: ApiUrlService, private _http: HttpClient) {}

  addAsset(data) {
    const apiURL = this.apiRUL.getUrl("addAsset");
    return this._http.post(apiURL, data);
  }

  
  getAsset(data) {
    isNullOrUndefined(data);
    const apiURL = this.apiRUL.getUrl("getAsset");
    return this._http.get(apiURL + data);
  }
}
