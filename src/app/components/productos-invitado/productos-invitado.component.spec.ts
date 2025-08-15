import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosInvitadoComponent } from './productos-invitado.component';

describe('ProductosInvitadoComponent', () => {
  let component: ProductosInvitadoComponent;
  let fixture: ComponentFixture<ProductosInvitadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductosInvitadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductosInvitadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
