import { Component, OnInit } from "@angular/core";
import { AlertController } from "@ionic/angular";
import { Subscription } from "rxjs";
import { isNullOrUndefined } from "util";
import { CompanyService } from "../common/service/company.service";
import { EmployeeService } from "../common/service/employee.service";
import { ToastService } from "../common/service/toast.service";

@Component({
  selector: "app-employee-delete",
  templateUrl: "./employee-delete.page.html",
  styleUrls: ["./employee-delete.page.scss"],
})
export class EmployeeDeletePage implements OnInit {
  constructor(
    private _company: CompanyService,
    private _emp: EmployeeService,
    private _toast: ToastService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.getcmpList();
  }
  cmpList = [];
  cmpListIds = [];
  getcmpList() {
    setTimeout(() => {
      this._company.getCompany().subscribe(
        (response: any) => {
          if (isNullOrUndefined(response.error)) {
            this.cmpList = response.data.companies;
            if (this.cmpList?.length > 0) {
              this.cmpListIds = this.cmpList.map((itm) => {
                return itm._id;
              });
              this.getEmp();
            }
          } else {
            this._toast.showWarning("Something Went Wrong. Please try again");
          }
        },
        (err) => {
          this._toast.showWarning(err.error.error);
        }
      );
    }, 1000);
  }

  selectAllEmp() {
    if (this.empList.length > 0) {
      this.empList.forEach((itm) => (itm.checked = true));
    }
  }

  getEmp() {
    this._emp.getDeletedEmployees(this.cmpListIds).subscribe(
      (response: any) => {
        console.log("response ===>", response);
        if (isNullOrUndefined(response.error)) {
          this.empList = response.data.employeeList;
          // this._toast.showWarning("Successfully Employee Fetched!");
        } else {
          this._toast.showWarning("Something Went Wrong. Please try again");
        }
      },
      (err) => {
        this._toast.showWarning(err.error.error);
      }
    );
  }

  empList = [];
  deleteMultipleLoading: Subscription;
  skelton = false;
  async deleteSelectedEmployee() {
    console.log("empList ==>", this.empList);
    const selected = this.empList.filter((itm) => itm.checked == true);
    let finalData = [];

    if (selected.length == 0) {
      this._toast.showWarning(
        "No Employee Selected, Please Select If You Want To Delete Multiple Employee's"
      );
    } else {
      for (let itm of selected) {
        finalData.push(itm._id);
      }
      const alert = await this.alertController.create({
        cssClass: "my-custom-class",
        header: "Do you want to proceed?",
        message: `Once You Will Delete Selected Employee. Their Data Will Be Permanently Delete from Database.`,
        buttons: [
          {
            text: "Cancel",
            role: "cancel",
            cssClass: "secondary",
            handler: (blah) => {
              console.log("Confirm Cancel: blah");
            },
          },
          {
            text: "Okay",
            handler: () => {
              this.skelton = true;
              if (this.deleteMultipleLoading) {
                this.deleteMultipleLoading.unsubscribe();
              }
              this.deleteMultipleLoading = this._emp
                .deleteMultipeEmployee(finalData)
                .subscribe(
                  (response: any) => {
                    this.skelton = false;
                    if (isNullOrUndefined(response.error)) {
                      this.ngOnInit();
                      this._toast.showWarning(
                        `Selecetd Employee's Are Successfully Deleted.`
                      );
                    } else {
                      this._toast.showWarning(
                        "Something Went Wrong While Deleting The Multiple Employee's. Please try again"
                      );
                    }
                  },
                  (err) => {
                    this.skelton = false;
                    this._toast.showWarning(err.error.error);
                  }
                );
            },
          },
        ],
      });

      await alert.present();
    }
  }
  /**
   * unsubscribe callback
   */
  ngOnDestroy() {
    if (this.deleteMultipleLoading) {
      this.deleteMultipleLoading.unsubscribe();
    }
  }
}
