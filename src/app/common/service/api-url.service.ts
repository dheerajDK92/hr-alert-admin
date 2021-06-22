import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
@Injectable({
  providedIn: "root",
})
export class ApiUrlService {
  hostUrl = environment.protocol + environment.apiURL;
  // Admin Links
  adminLoginLink = "/admin/login";
  dashboardLink = "/admin/dashboard";
  getCompanyLink = "/admin/dashboard/getCompany";
  registerCompanyLink = "/admin/dashboard/registerCompany";
  updateCompanyLink = "/admin/dashboard/updateCompany";
  deleteCompanyLink = "/admin/dashboard/deleteCompany";
  uploadCompanyLogoLink = "/admin/CompanyLogo/upload";
  getCompanyLogoLink = "/admin/CompanyLogo/images";
  getAllFeedbackLink = "/admin/dashboard/getAllFeedback";
  sendMailLink = "/admin/dashboard/sendMail";

  // Employee Links
  addEmployeeLink = "/employee/register";
  getEmployeeListLink = "/employee/getEmployeeList";
  updateEmployeeLink = "/employee/updateEmployee";
  uploadEmployeePicLink = "/employee/uploadPic";
  uploadPANLink = "/employee/uploadPAN";
  uploadADHAARLink = "/employee/uploadADHAAR";
  deleteEmployeeLink = "/employee/deleteEmployee";
  deleteMultipeEmployeeLink = "/employee/deleteMultiple";

  uploadMultipleEmpLink = "/employee/registerMultiple";
  validateIFSCLink = "/employee/ifsc/validate";
  saveBankDetailsLink = "/employee/KYC/saveBankDetails";
  getBankDetailsLink = "/employee/KYC/getBankDetails";
  savePANDetailsLink = "/employee/KYC/savePAN";
  getPANDetailsLink = "/employee/KYC/getPANDetails";
  getPANImageDetailsLink = "/employee/KYC/getPANImageDetails";
  getADHAARImageDetailsLink = "/employee/KYC/getADHAARImageDetails";
  saveAdhaarDetailsLink = "/employee/KYC/saveADHAAR";
  getADHAARDetailsLink = "/employee/KYC/getADHAARDetails";
  getRequestAdvanceForAdminLink = "/employee/advance/All";
  getRequestReimbursementForAdminLink = "/employee/reimbursement/All";
  getRequestLeaveForAdminLink = "/employee/leave/All";
  empFetchPunchLink = "/employee/punch/empFetch";
  startMultiplePunchLink = "/employee/punch/startMultiple";
  updateAdvanceStatusLink = "/employee/advance/update";
  getRequestAdvanceLink = "/employee/advance/fetch";
  updateReimbursementStatusLink = "/employee/reimbursement/update";
  getRequestReimbursementLink = "/employee/reimbursement/fetch";
  updateLeaveStatusLink = "/employee/leave/update";
  getRequestLeaveLink = "/employee/leave/fetch";
  getCompanyEmployeeLink = "/employee/getCompanyEmployee";
  getTodayWorkForceLink = "/employee/punch/fetchTodaySitePunch";
  getMonthlyAttendanceLink = "/employee/getMonthlyAttendance";
  sendSalarySlipLink = "/employee/punch/sendSalarySlip";
  sendMultipleSalarySlipLink = "/employee/punch/sendMultipleSalarySlip";
  getSalaryByMonthLink = "/employee/punch/getSalaryByMonth";
  deleteMultiplePunchedLink = "/employee/punch/deleteMultiplePunched";
  deleteEmployeeCalculatedSalariesLink = "/employee/punch/deleteEmployeeCalculatedSalaries";
  getDeletedEmployeeListLink = "/employee/getDeletedEmployeeList";
  // asset
  addAssetLink = "/asset/addAsset";
  getAssetLink = "/asset/loadAsset";
  constructor() {}
  getUrl(key: String) {
    let url: any;
    if (key == "adminLogin") {
      url = this.hostUrl + this.adminLoginLink;
    } else if (key == "adminDashboard") {
      url = this.hostUrl + this.dashboardLink;
    } else if (key == "addCompany") {
      url = this.hostUrl + this.registerCompanyLink;
    } else if (key == "getCompany") {
      url = this.hostUrl + this.getCompanyLink;
    } else if (key == "updateCompany") {
      url = this.hostUrl + this.updateCompanyLink;
    } else if (key == "deleteCompany") {
      url = this.hostUrl + this.deleteCompanyLink;
    } else if (key == "uploadCompanyLogo") {
      url = this.hostUrl + this.uploadCompanyLogoLink;
    } else if (key == "addEmployee") {
      url = this.hostUrl + this.addEmployeeLink;
    } else if (key == "getEmployeeList") {
      url = this.hostUrl + this.getEmployeeListLink;
    } else if (key == "updateEmployee") {
      url = this.hostUrl + this.updateEmployeeLink;
    } else if (key == "getCompanyLogo") {
      url = this.hostUrl + this.getCompanyLogoLink;
    } else if (key == "uploadEmployeePic") {
      url = this.hostUrl + this.uploadEmployeePicLink;
    } else if (key == "deleteEmployee") {
      url = this.hostUrl + this.deleteEmployeeLink;
    } else if (key == "uploadMultipleEmp") {
      url = this.hostUrl + this.uploadMultipleEmpLink;
    } else if (key == "validateIFSC") {
      url = this.hostUrl + this.validateIFSCLink;
    } else if (key == "saveBankDetails") {
      url = this.hostUrl + this.saveBankDetailsLink;
    } else if (key == "getBankDetails") {
      url = this.hostUrl + this.getBankDetailsLink;
    } else if (key == "getAllFeedback") {
      url = this.hostUrl + this.getAllFeedbackLink;
    } else if (key == "sendMail") {
      url = this.hostUrl + this.sendMailLink;
    } else if (key == "getRequestAdvanceForAdmin") {
      url = this.hostUrl + this.getRequestAdvanceForAdminLink;
    } else if (key == "getRequestReimbursementForAdmin") {
      url = this.hostUrl + this.getRequestReimbursementForAdminLink;
    } else if (key == "getRequestLeaveForAdmin") {
      url = this.hostUrl + this.getRequestLeaveForAdminLink;
    } else if (key == "savePANDetails") {
      url = this.hostUrl + this.savePANDetailsLink;
    } else if (key == "getPANDetails") {
      url = this.hostUrl + this.getPANDetailsLink;
    } else if (key == "saveAdhaarDetails") {
      url = this.hostUrl + this.saveAdhaarDetailsLink;
    } else if (key == "getADHAARDetails") {
      url = this.hostUrl + this.getADHAARDetailsLink;
    } else if (key == "deleteMultipeEmployee") {
      url = this.hostUrl + this.deleteMultipeEmployeeLink;
    } else if (key == "empFetchPunch") {
      url = this.hostUrl + this.empFetchPunchLink;
    } else if (key == "updateAdvanceStatus") {
      url = this.hostUrl + this.updateAdvanceStatusLink;
    } else if (key == "getRequestAdvance") {
      url = this.hostUrl + this.getRequestAdvanceLink;
    } else if (key == "updateReimbursementStatus") {
      url = this.hostUrl + this.updateReimbursementStatusLink;
    } else if (key == "getRequestReimbursement") {
      url = this.hostUrl + this.getRequestReimbursementLink;
    } else if (key == "updateLeaveStatus") {
      url = this.hostUrl + this.updateLeaveStatusLink;
    } else if (key == "getRequestLeave") {
      url = this.hostUrl + this.getRequestLeaveLink;
    } else if (key == "getCompanyEmployee") {
      url = this.hostUrl + this.getCompanyEmployeeLink;
    } else if (key == "startMultiplePunch") {
      url = this.hostUrl + this.startMultiplePunchLink;
    } else if (key == "uploadPAN") {
      url = this.hostUrl + this.uploadPANLink;
    } else if (key == "uploadADHAAR") {
      url = this.hostUrl + this.uploadADHAARLink;
    } else if (key == "getPANImageDetails") {
      url = this.hostUrl + this.getPANImageDetailsLink;
    } else if (key == "getADHAARImageDetails") {
      url = this.hostUrl + this.getADHAARImageDetailsLink;
    } else if (key == "getTodayWorkForce") {
      url = this.hostUrl + this.getTodayWorkForceLink;
    } else if (key == "getMonthlyAttendance") {
      url = this.hostUrl + this.getMonthlyAttendanceLink;
    } else if (key == "sendSalarySlip") {
      url = this.hostUrl + this.sendSalarySlipLink;
    } else if (key == "addAsset") {
      url = this.hostUrl + this.addAssetLink;
    } else if (key == "getAsset") {
      url = this.hostUrl + this.getAssetLink;
    } else if (key == "sendMultipleSalarySlip") {
      url = this.hostUrl + this.sendMultipleSalarySlipLink;
    } else if (key == "getSalaryDetailsByMonth") {
      url = this.hostUrl + this.getSalaryByMonthLink;
    } else if (key == "deleteMultiplePunched") {
      url = this.hostUrl + this.deleteMultiplePunchedLink;
    } else if (key == "getDeletedEmployeeList") {
      url = this.hostUrl + this.getDeletedEmployeeListLink;
    } else if (key == "deleteEmployeeCalculatedSalaries") {
      url = this.hostUrl + this.deleteEmployeeCalculatedSalariesLink;
    }

    return url;
  }
}
