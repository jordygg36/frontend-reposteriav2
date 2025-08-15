import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../../services/productos.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // Importamos AuthService

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
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

  addUser() {
    this.router.navigate(['/agregar-usuario']); // Navegar a la ruta de agregar usuario
  }

  editUser(id_usuario: string) {
    this.router.navigate(['/editar-usuario', id_usuario]); // Navegar a la ruta de editar usuario
  }
  
  deleteUser(id_usuario: string) {
    this.productosService.deleteProduct(id_usuario).subscribe(() => {
      this.arrayProducts = this.arrayProducts.filter((user: any) => user.id_usuario !== id_usuario);
    });
  }

  addCarrito(idProducto: string) {
    const userId = this.authService.getUserData(); // Get the authenticated user's ID
    if (!userId) {
        alert('Debes iniciar sesión para agregar productos al carrito.');
        return;
    }

    const productoSeleccionado = { idproductos: idProducto, idusuarios: userId, cantidad: 1 };
    this.productosService.postCarrito(productoSeleccionado).subscribe({
        next: (response) => {
            console.log('Producto agregado:', response);
            this.router.navigate(['/carrito-compras']);
        },
        error: (error) => {
            console.error('Error al agregar al carrito:', error);
            alert('Hubo un problema al agregar el producto al carrito.');
        }
    });
  }

  addToCart(product: any): void {
    const cartItem = {
      idproductos: product.idproductos,
      idusuarios: this.authService.getUserData(), // Get the authenticated user's ID
      cantidad: 1 // Default quantity is 1
    };

    this.productosService.postCarrito(cartItem).subscribe({
      next: () => {
        alert('Producto agregado al carrito con éxito.');
      },
      error: (error) => {
        console.error('Error al agregar el producto al carrito:', error);
        alert('Hubo un problema al agregar el producto al carrito.');
      }
    });
  }
}
