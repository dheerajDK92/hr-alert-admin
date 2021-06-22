import { Injectable } from "@angular/core";
import { ApiUrlService } from "./api-url.service";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class EmployeeService {
  constructor(private apiRUL: ApiUrlService, private _http: HttpClient) {}

  registerEmployee(data) {
    const url = this.apiRUL.getUrl("addEmployee");
    return this._http.post(url, data);
  }

  registerMultipleEmployee(data) {
    const url = this.apiRUL.getUrl("uploadMultipleEmp");
    return this._http.post(url, data);
  }

  updateEmployee(data) {
    const url = this.apiRUL.getUrl("updateEmployee");
    return this._http.put(url, data);
  }

  getEmployeeList(data) {
    const url = this.apiRUL.getUrl("getEmployeeList") + "/" + data._id;
    return this._http.get(url);
  }

  validateIFSC(ifsc) {
    const url = this.apiRUL.getUrl("validateIFSC") + "/" + ifsc;
    return this._http.get(url);
  }

  deleteEmployee(data) {
    const options: any = {
      body: {
        _id: data._id,
      },
    };
    const url = this.apiRUL.getUrl("deleteEmployee");
    return this._http.delete(url, options);
  }

  deleteMultipeEmployee(data) {
    const options: any = {
      body: {
        data: data,
      },
    };
    const url = this.apiRUL.getUrl("deleteMultipeEmployee");
    return this._http.delete(url, options);
  }

  saveBankDetails(data) {
    const url = this.apiRUL.getUrl("saveBankDetails");
    return this._http.post(url, data);
  }

  getBankDetails(empId) {
    const url = this.apiRUL.getUrl("getBankDetails") + "/" + empId;
    return this._http.get(url);
  }

  savePANDetails(data) {
    const url = this.apiRUL.getUrl("savePANDetails");
    return this._http.post(url, data);
  }

  getPANDetails(empId) {
    const url = this.apiRUL.getUrl("getPANDetails") + "/" + empId;
    return this._http.get(url);
  }

  getPANImageDetails(empId) {
    const url = this.apiRUL.getUrl("getPANImageDetails") + "/" + empId;
    return this._http.get(url);
  }

  getADHAARImageDetails(empId) {
    const url = this.apiRUL.getUrl("getADHAARImageDetails") + "/" + empId;
    return this._http.get(url);
  }

  saveAdhaarDetails(data) {
    const url = this.apiRUL.getUrl("saveAdhaarDetails");
    return this._http.post(url, data);
  }

  getADHAARDetails(empId) {
    const url = this.apiRUL.getUrl("getADHAARDetails") + "/" + empId;
    return this._http.get(url);
  }

  getAllFeedback() {
    const url = this.apiRUL.getUrl("getAllFeedback");
    return this._http.get(url);
  }

  sendMail(data) {
    const url = this.apiRUL.getUrl("sendMail");
    return this._http.post(url, data);
  }
  getRequestAdvanceForAdmin(companyId) {
    const apiURL =
      this.apiRUL.getUrl("getRequestAdvanceForAdmin") + "/" + companyId;
    return this._http.get(apiURL);
  }

  getRequestReimbursementForAdmin(companyId) {
    const apiURL =
      this.apiRUL.getUrl("getRequestReimbursementForAdmin") + "/" + companyId;
    return this._http.get(apiURL);
  }

  getRequestLeaveForAdmin(companyId) {
    const apiURL =
      this.apiRUL.getUrl("getRequestLeaveForAdmin") + "/" + companyId;
    return this._http.get(apiURL);
  }

  empFetchPunch(date) {
    const apiURL = this.apiRUL.getUrl("empFetchPunch");
    return this._http.post(apiURL, date);
  }

  updateAdvanceStatus(data) {
    const apiURL = this.apiRUL.getUrl("updateAdvanceStatus");
    return this._http.put(apiURL, data);
  }

  getRequestAdvance(id) {
    const apiURL = this.apiRUL.getUrl("getRequestAdvance") + "/" + id;
    return this._http.get(apiURL);
  }
  updateReimbursementStatus(data) {
    const apiURL = this.apiRUL.getUrl("updateReimbursementStatus");
    return this._http.put(apiURL, data);
  }

  getRequestReimbursement(id) {
    const apiURL = this.apiRUL.getUrl("getRequestReimbursement") + "/" + id;
    return this._http.get(apiURL);
  }
  updateLeaveStatus(data) {
    const apiURL = this.apiRUL.getUrl("updateLeaveStatus");
    return this._http.put(apiURL, data);
  }
  getRequestLeave(id) {
    const apiURL = this.apiRUL.getUrl("getRequestLeave") + "/" + id;
    return this._http.get(apiURL);
  }
  getCompanyEmployeeDetail(id) {
    const apiURL = this.apiRUL.getUrl("getCompanyEmployee") + "/" + id;
    return this._http.get(apiURL);
  }

  startMultiplePunch(date) {
    const apiURL = this.apiRUL.getUrl("startMultiplePunch");
    return this._http.post(apiURL, date);
  }

  getTodayWorkForce(data) {
    const apiURL = this.apiRUL.getUrl("getTodayWorkForce");
    return this._http.post(apiURL, data);
  }

  getMonthlyAttendance(date) {
    const apiURL = this.apiRUL.getUrl("getMonthlyAttendance");
    return this._http.post(apiURL, date);
  }

  sendSalarySlip(data) {
    const apiURL = this.apiRUL.getUrl("sendSalarySlip");
    return this._http.post(apiURL, data);
  }

  startMultipleSalaryUpload(data) {
    const apiURL = this.apiRUL.getUrl("sendMultipleSalarySlip");
    return this._http.post(apiURL, data);
  }
  getSalaryDetailsByMonth(data) {
    const apiURL = this.apiRUL.getUrl("getSalaryDetailsByMonth");
    return this._http.post(apiURL, data);
  }

  deleteEmployeePunch(data) {
    const options: any = {
      body: {
        data: data,
      },
    };
    const url = this.apiRUL.getUrl("deleteMultiplePunched");
    return this._http.delete(url, options);
    // const apiURL = this.apiRUL.getUrl("deleteMultiplePunched");
    // return this._http.delete(apiURL, data);
  }

  deleteEmployeeCalculatedSalaries(data) {
    const options: any = {
      body: {
        data: data,
      },
    };
    const url = this.apiRUL.getUrl("deleteEmployeeCalculatedSalaries");
    return this._http.delete(url, options);
    // const apiURL = this.apiRUL.getUrl("deleteMultiplePunched");
    // return this._http.delete(apiURL, data);
  }

  getDeletedEmployees(data) {
    const apiURL = this.apiRUL.getUrl("getDeletedEmployeeList");
    return this._http.post(apiURL, data);
  }
}
