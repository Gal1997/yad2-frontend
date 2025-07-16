import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NadlanFormComponent } from './nadlan-form.component';

describe('NadlanFormComponent', () => {
  let component: NadlanFormComponent;
  let fixture: ComponentFixture<NadlanFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NadlanFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NadlanFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
