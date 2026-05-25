import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneroPopupComponent } from './genero-popup.component';

describe('GeneroPopupComponent', () => {
  let component: GeneroPopupComponent;
  let fixture: ComponentFixture<GeneroPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneroPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneroPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
