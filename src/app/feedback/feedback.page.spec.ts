import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { feedbackPage } from './feedback.page';

describe('feedbackPage', () => {
  let component: feedbackPage;
  let fixture: ComponentFixture<feedbackPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ feedbackPage ],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(feedbackPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
