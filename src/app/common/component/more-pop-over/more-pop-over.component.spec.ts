import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MorePopOverComponent } from './more-pop-over.component';

describe('MorePopOverComponent', () => {
  let component: MorePopOverComponent;
  let fixture: ComponentFixture<MorePopOverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MorePopOverComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MorePopOverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
