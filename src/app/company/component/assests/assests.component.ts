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
import { Subscription } from "rxjs";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { AssetService } from "src/app/common/service/asset.service";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: "app-assets",
  templateUrl: "./assests.component.html",
  styleUrls: ["./assests.component.scss"],
})
export class AssetsComponent implements OnInit, OnChanges {
  public main: string;
  EmpData: any = null;
  CmpData: any = null;
  @Output() public successFullyRegister = new EventEmitter();
  @Input("companyDetails") companyDetails: any;

  isEmployeeLoading: Subscription;
  constructor(private _asset: AssetService, private _toast: ToastService) {}

  backToMain() {
    this.successFullyRegister.emit("true");
  }

  ngOnChanges(changes: any) {
    if (changes.companyDetails) {
      this.companyDetails = changes.companyDetails.currentValue;
      this.data.companyId = this.companyDetails._id;
    }
  }
  punchDate: any;
  ngOnInit() {
    this.loadAssets();
  }
  listView = true;
  addView = false;
  data = {
    assetName: null,
    assetCategory: null,
    assetPrice: null,
    companyId: null,
  };
  segmentChanged(event) {
    const selectedSegment = event.detail.value;
    if (selectedSegment == "assetsList") {
      this.listView = true;
      this.addView = false;
    } else if (selectedSegment == "addAssets") {
      this.listView = false;
      this.addView = true;
    }
  }

  submit() {
    this._asset.addAsset(this.data).subscribe(
      (response: any) => {
        if (isNullOrUndefined(response.error)) {
          this.listView = true;
          this.addView = false;
          this.loadAssets();
          this._toast.showWarning("Successfully Asset Added");
          this.data.assetName=null;
          this.data.assetCategory=null;
          this.data.assetPrice=null;
        } else {
          this._toast.showWarning("Something Went Wrong. Please try again");
        }
      },
      (err) => {
        this._toast.showWarning(err.error.error);
      }
    );
  }
  list = [];
  loadAssets() {
    this._asset.getAsset(`/${this.companyDetails._id}`).subscribe(
      (response: any) => {
        if (isNullOrUndefined(response.error)) {
          this.list = response.data.AssetDetails;
        } else {
          this._toast.showWarning("Something Went Wrong. Please try again");
        }
      },
      (err) => {
        this._toast.showWarning(err.error.error);
      }
    );
  }
}
