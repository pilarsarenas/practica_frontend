import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PuestoTrabajoPopupComponent } from './puesto-trabajo-popup.component';

describe('PuestoTrabajoPopupComponent', () => {
  let component: PuestoTrabajoPopupComponent;
  let fixture: ComponentFixture<PuestoTrabajoPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PuestoTrabajoPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PuestoTrabajoPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
