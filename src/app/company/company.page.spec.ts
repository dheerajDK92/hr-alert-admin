import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { companyPage } from './company.page';

describe('companyPage', () => {
  let component: companyPage;
  let fixture: ComponentFixture<companyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ companyPage ],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(companyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
