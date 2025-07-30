import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NadlanPageComponent } from './nadlan-page.component';

describe('NadlanPageComponent', () => {
  let component: NadlanPageComponent;
  let fixture: ComponentFixture<NadlanPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NadlanPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NadlanPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
