import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VillaPageComponent } from './villa-page.component';

describe('VillaPageComponent', () => {
  let component: VillaPageComponent;
  let fixture: ComponentFixture<VillaPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VillaPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VillaPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
