import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";
import { siteQRComponent } from "./siteQR.component";

describe("siteQRComponent", () => {
  let component: siteQRComponent;
  let fixture: ComponentFixture<siteQRComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [siteQRComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(siteQRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
