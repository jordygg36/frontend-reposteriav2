import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../../services/productos.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule} from '@angular/router';
import { AuthService } from '../../services/auth.service'; // Importamos AuthService

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './productos-invitado.component.html',
  styleUrls: ['./productos-invitado.component.css']
})
export class ProductosInvitadoComponent implements OnInit {
  arrayProducts: any = [];
  agregarCarrito: any = {};
  isAuthenticated: boolean = false; // Controla si el usuario está autenticado
  products: any[] = []; // Define the products array

  constructor(
    public productosService: ProductosService, 
    private router: Router, 
    private authService: AuthService // Inyectamos el servicio de autenticación
  ) {}

  ngOnInit(): void {
    this.fetch();
    this.authService.isAuthenticated$.subscribe(auth => {
      this.isAuthenticated = auth; // Verifica autenticación
    });
    this.isAuthenticated = this.authService.hasToken(); // Check if the user is authenticated
    this.fetchProducts(); // Fetch products on component initialization
  }

  fetch() {
    this.productosService.fetchProduct().subscribe(result => {
      this.arrayProducts = result;
    });
  }
  
  fetchProducts(): void {
    this.productosService.fetchProduct().subscribe({
      next: (response) => {
        this.products = response; // Assign the fetched products to the products array
      },
      error: (error) => {
        console.error('Error fetching products:', error);
      }
    });
  }

  



}
