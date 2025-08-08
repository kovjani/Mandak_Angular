import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepertoirePageComponent } from './repertoire-page.component';

describe('RepertoirePageComponent', () => {
  let component: RepertoirePageComponent;
  let fixture: ComponentFixture<RepertoirePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepertoirePageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RepertoirePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
