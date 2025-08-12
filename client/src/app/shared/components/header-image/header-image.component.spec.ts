import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderImageComponent } from './header-image.component';

describe('HeaderImageComponent', () => {
  let component: HeaderImageComponent;
  let fixture: ComponentFixture<HeaderImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderImageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HeaderImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
