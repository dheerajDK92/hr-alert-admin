import { Injectable } from "@angular/core";
import { ApiUrlService } from "./api-url.service";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class CompanyService {
  constructor(private apiRUL: ApiUrlService, private _http: HttpClient) {}

  registerCompany(data) {
    const url = this.apiRUL.getUrl("addCompany");
    return this._http.post(url, data);
  }

  updateCompany(data) {
    const url = this.apiRUL.getUrl("updateCompany");
    return this._http.put(url, data);
  }

  deleteCompany(data) {
    const options: any = {
      body: {
        companyName: data.companyName,
        address: data.address,
        address2: data.address2,
        city: data.city,
        country: data.city,
        description: data.description,
        email: data.email,
        phone: data.phone,
        pincode: data.pincode,
        state: data.state,
        _id: data._id,
      },
    };
    const url = this.apiRUL.getUrl("deleteCompany");
    return this._http.delete(url, options);
  }

  getCompany() {
    const url = this.apiRUL.getUrl("getCompany");
    return this._http.get(url);
  }

  getCompanyLogo(imageId) {
    const url = this.apiRUL.getUrl("getCompanyLogo") + "/" + imageId;
    return this._http.get(url);
  }
}
