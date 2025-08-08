import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CookieWarningComponent } from './cookie-warning.component';

describe('CookieWarningComponent', () => {
  let component: CookieWarningComponent;
  let fixture: ComponentFixture<CookieWarningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CookieWarningComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CookieWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
