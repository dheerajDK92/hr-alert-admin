import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { UploadCSVPunchComponent } from "./upload-punch-csv.component";

describe("UploadCSVPunchComponent", () => {
  let component: UploadCSVPunchComponent;
  let fixture: ComponentFixture<UploadCSVPunchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UploadCSVPunchComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(UploadCSVPunchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
