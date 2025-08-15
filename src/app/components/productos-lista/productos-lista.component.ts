import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../../services/productos.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // Importamos AuthService

@Component({
  selector: 'app-productos-lista',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productos-lista.component.html',
  styleUrls: ['./productos-lista.component.css']
})
export class ProductosListaComponent implements OnInit {
  arrayProducts: any = [];
  filteredProducts: any = [];
  searchQuery: string = '';
  agregarCarrito: any = {};
  isAuthenticated: boolean = false; // Controla si el usuario está autenticado

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
  }

  fetch() {
    this.productosService.fetchProduct().subscribe(result => {
      this.arrayProducts = result;
      this.filteredProducts = result; // Initialize filteredProducts with all products
    });
  }
  
  addProduct() {
    this.router.navigate(['/crear-productos']); // Navegar a la ruta de agregar producto
  }

  editProduct(idproductos: string) {
    this.router.navigate(['/edit-product', idproductos]); // Navegar a la ruta de editar producto
  }

  deleteProduct(idproductos: string) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      this.productosService.deleteProduct(idproductos).subscribe(() => {
        this.arrayProducts = this.arrayProducts.filter((product: any) => product.idproductos !== idproductos);
        this.filteredProducts = this.filteredProducts.filter((product: any) => product.idproductos !== idproductos); // Update filteredProducts
        console.log('Producto eliminado');
      });
    }
  }

  


  filterProducts(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredProducts = this.arrayProducts.filter((product: any) =>
      product.nombre.toLowerCase().includes(query) ||
      product.descripcion.toLowerCase().includes(query)
    );
  }
}
