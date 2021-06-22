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
  selector: "app-employee-id",
  templateUrl: "./employee-id.component.html",
  styleUrls: ["./employee-id.component.scss"],
})
export class EmployeeIDComponent implements OnInit, OnChanges {
  @Input("selectedEmpDetails") selectedEmpDetails: any;
  isQrCodeSection:boolean = false;
  isEmployeeLoading: Subscription;
  elementType = 'url';
  value = 'Alert Care';
  constructor(
    private _api: ApiUrlService,
    private plt: Platform,
    private _emp: EmployeeService,
    private _toast: ToastService,
    private file: File,
    private fileOpener: FileOpener,
    private modalController: ModalController,
    private _util: LoaderService
  ) {}
  /**
   * Dummy
   */
  ngOnInit() {
    console.log("this.selectedEmpDetails ===>", this.selectedEmpDetails)
    this.value = this.selectedEmpDetails._id;
  }

  ngOnChanges(changes: any) {
    if (changes.selectedEmpDetails) {
      this.selectedEmpDetails = changes.selectedEmpDetails.currentValue;
    }
  }
  cancelPopUp() {
    this.modalController.dismiss();
  }
  changeQRView(){
    this.isQrCodeSection = !this.isQrCodeSection;
  }
  print(){
    window.print()
  }
}
