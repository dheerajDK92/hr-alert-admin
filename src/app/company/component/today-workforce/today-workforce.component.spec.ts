import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";
import { TodayWorkForceComponent } from "./today-workforce.component";

describe("EmployeeReportComponent", () => {
  let component: TodayWorkForceComponent;
  let fixture: ComponentFixture<TodayWorkForceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TodayWorkForceComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(TodayWorkForceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
