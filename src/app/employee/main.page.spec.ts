import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { employeePage } from './employee.page';

describe('employeePage', () => {
  let component: employeePage;
  let fixture: ComponentFixture<employeePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ employeePage ],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(employeePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
