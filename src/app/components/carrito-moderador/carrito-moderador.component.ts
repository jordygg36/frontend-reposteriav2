import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../../services/productos.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-carrito-moderador',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './carrito-moderador.component.html',
  styleUrls: ['./carrito-moderador.component.css']
})
export class CarritoModeradorComponent implements OnInit {
  arrayCarritos: any = [];
  constructor(public productosService: ProductosService, private router: Router) {}

  ngOnInit(): void {
    this.fetch();
  }

  fetch() {
    const userId = '0'; // Use '0' to fetch all carts for the moderator
    this.productosService.fetchCarrito(userId).subscribe(result => {
        this.arrayCarritos = result;
    });
  }

  deleteCarrito(idcarrito: string) {
    this.productosService.deleteCar(idcarrito).subscribe(() => {
      this.arrayCarritos = this.arrayCarritos.filter((user: any) => user.idcarrito !== idcarrito);
    });
  }
}
