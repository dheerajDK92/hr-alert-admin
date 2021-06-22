import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";
import { manualPunchComponent } from "./manualPunch.component";

describe("manualPunchComponent", () => {
  let component: manualPunchComponent;
  let fixture: ComponentFixture<manualPunchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [manualPunchComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(manualPunchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
