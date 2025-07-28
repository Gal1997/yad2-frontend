import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Yad2FormComponent } from './yad2-form.component';

describe('Yad2FormComponent', () => {
  let component: Yad2FormComponent;
  let fixture: ComponentFixture<Yad2FormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Yad2FormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Yad2FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
