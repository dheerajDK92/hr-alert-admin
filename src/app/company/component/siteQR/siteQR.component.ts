import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  OnChanges,
  OnDestroy,
} from "@angular/core";
import { EmployeeService } from "src/app/common/service/employee.service";
import { isNullOrUndefined } from "util";
import { ToastService } from "src/app/common/service/toast.service";
import { AlertController, ModalController, Platform } from "@ionic/angular";
import { Subscription } from "rxjs";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { File } from "@ionic-native/file/ngx";
import { FileOpener } from "@ionic-native/file-opener/ngx";
import { ApiUrlService } from "src/app/common/service/api-url.service";
import { LoaderService } from "src/app/common/service/loder.service";
@Component({
  selector: "app-siteQR",
  templateUrl: "./siteQR.component.html",
  styleUrls: ["./siteQR.component.scss"],
})
export class siteQRComponent implements OnInit, OnChanges {
  public main: string;
  EmpData: any = null;
  CmpData: any = null;
  @Output() public successFullyRegister = new EventEmitter();
  @Input("companyDetails") companyDetails: any;
  siteSelected: any;
  isEmployeeLoading: Subscription;
  constructor(
    private _emp: EmployeeService,
    private _api: ApiUrlService,
    private _toast: ToastService,
    private plt: Platform,
    private file: File,
    private fileOpener: FileOpener
  ) {}

  backToMain() {
    this.successFullyRegister.emit("true");
  }

  ngOnChanges(changes: any) {
    console.log("changes ===>", changes);
    if (changes.companyDetails) {
      this.companyDetails = changes.companyDetails.currentValue;
    }
  }

  ngOnInit() {
    this.loadCompanyEmp();
  }
  /**
   * load company employee details
   */
  employees: any = [];
  sites: any = [];
  loadCompanyEmp() {
    if (this.isEmployeeLoading) {
      this.isEmployeeLoading.unsubscribe();
    }
    this.isEmployeeLoading = this._emp
      .getCompanyEmployeeDetail(this.companyDetails._id)
      .subscribe(
        (response: any) => {
          if (isNullOrUndefined(response.error)) {
            console.log("response ===>", response.data.employeeList);
            this.employees = response.data.employeeList;
            const uniqueSite = [
              ...new Set(response.data.employeeList.map((obj) => obj.Site)),
            ];
            this.sites = uniqueSite;
          } else {
            this._toast.showWarning("Something Went Wrong. Please try again");
          }
        },
        (err) => {
          this._toast.showWarning(err.error.error);
        }
      );
  }
  /**
   * Null check
   */
  isNull(val) {
    return val == "" || val == null || val == undefined;
  }
  /**
   *
   */
  downloadSiteBarcode() {
    if (this.isNull(this.siteSelected)) {
      this._toast.showWarning("Please Select Site To Proceed.");
    } else {
      console.log("siteSelected", this.siteSelected);
      const employeesForSite = this.employees.filter(
        (itm) => itm.Site == this.siteSelected
      );
      console.log("employeesForSite", employeesForSite);
      this.createLeavePdf(employeesForSite);
    }
  }
  /**
   * create pdf
   */
  pdfObj = null;
  createLeavePdf(employeesForSite) {
    /**
     * creating the pdf data - start
     */
    const finalPage = [];
    /**
     * looping the filtered employee site vise - start
     */
    for (let itm of employeesForSite) {
      console.log("itm ===>", itm);
      finalPage.push(" ");
      finalPage.push(" ");
      finalPage.push(" ");
      finalPage.push({
        text: `${itm.empname} Detail's`,
        style: "header",
        color: "blue",
        bold: true,
      });
      finalPage.push({ text: `Employee Detail`, alignment: "right" });
      finalPage.push({ text: new Date().toTimeString(), alignment: "right" });
      finalPage.push(" ");
      finalPage.push(" ");
      finalPage.push({
        columns: [
          { qr: itm._id, alignment: "center" },
          {
            stack: [
              `Emp ID: ${itm.empID}`,
              `Site: ${itm.Site}`,
              `Designation: ${itm.designation}`,
              `Company: ${this.companyDetails.companyName}`,
              `Email: ${itm.email}`,
              `Phone: ${itm.phone}`,
              `Country: ${itm.country}`,
            ],
            fontSize: 15,
          },
        ],
      });
    }
    /**
     * looping the filtered employee site vise - end
     */
    var docDefinition = {
      content: finalPage,
      styles: {
        header: {
          fontSize: 18,
          bold: true,
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 15, 0, 0],
        },
        story: {
          italic: true,
          alignment: "center",
          width: "50%",
        },
      },
    };
    this.pdfObj = pdfMake.createPdf(docDefinition);
    this.downloadPdf();
  }

  downloadPdf() {
    if (this.plt.is("cordova")) {
      this.pdfObj.getBuffer((buffer) => {
        var blob = new Blob([buffer], { type: "application/pdf" });

        // Save the PDF to the data Directory of our App
        this.file
          .writeFile(this.file.dataDirectory, "reimbursements.pdf", blob, {
            replace: true,
          })
          .then((fileEntry) => {
            // Open the PDf with the correct OS tools
            this.fileOpener.open(
              this.file.dataDirectory + "reimbursements.pdf",
              "application/pdf"
            );
          });
      });
    } else {
      // On a browser simply use download!
      this.pdfObj.download();
    }
  }

  /**
   * pdf end
   */
}
