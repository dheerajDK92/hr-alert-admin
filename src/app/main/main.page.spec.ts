import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { mainPage } from './main.page';

describe('mainPage', () => {
  let component: mainPage;
  let fixture: ComponentFixture<mainPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ mainPage ],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(mainPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
