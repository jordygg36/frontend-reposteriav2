import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarritoModeradorComponent } from './carrito-moderador.component';

describe('CarritoModeradorComponent', () => {
  let component: CarritoModeradorComponent;
  let fixture: ComponentFixture<CarritoModeradorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarritoModeradorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarritoModeradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
