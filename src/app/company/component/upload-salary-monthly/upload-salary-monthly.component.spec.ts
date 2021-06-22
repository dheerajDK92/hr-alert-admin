import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { UploadSalaryMonthlyComponent } from "./upload-salary-monthly.component";

describe("UploadSalaryMonthlyComponent", () => {
  let component: UploadSalaryMonthlyComponent;
  let fixture: ComponentFixture<UploadSalaryMonthlyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UploadSalaryMonthlyComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(UploadSalaryMonthlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
