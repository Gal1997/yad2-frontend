import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BubblesCategoryComponent } from './bubbles-category.component';

describe('BubblesCategoryComponent', () => {
  let component: BubblesCategoryComponent;
  let fixture: ComponentFixture<BubblesCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BubblesCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BubblesCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
