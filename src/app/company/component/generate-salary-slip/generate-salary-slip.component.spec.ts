import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";
import { GenerateSalarySlipComponent } from "./generate-salary-slip.component";

describe("GenerateSalarySlipComponent", () => {
  let component: GenerateSalarySlipComponent;
  let fixture: ComponentFixture<GenerateSalarySlipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GenerateSalarySlipComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(GenerateSalarySlipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
