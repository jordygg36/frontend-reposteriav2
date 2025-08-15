import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../../services/productos.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; 
import { AuthService } from '../../services/auth.service'; // Import AuthService

@Component({
  selector: 'app-carrito-compras',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './carrito-compras.component.html',
  styleUrl: './carrito-compras.component.css'
})
export class CarritoComprasComponent implements OnInit {
  arrayCarritos: any = [];
  totalPrice: number = 0;
  userId: string | null = null; // Store the authenticated user's ID

  constructor(
    public productosService: ProductosService, 
    private authService: AuthService, // Inject AuthService
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserData(); // Get the authenticated user's ID
    this.fetch();
  }

  fetch() {
    if (!this.userId) {
      console.error('User ID is not available');
      return;
    }
    this.productosService.fetchCarrito(this.userId).subscribe(result => {
        this.arrayCarritos = result.map((item: any) => ({
            ...item,
            cantidad: item.cantidad || 1 // Ensure cantidad is set, default to 1 if undefined
        }));
        this.calculateTotalPrice();
    });
  }

  deleteCarrito(idcarrito: string) {
    this.productosService.deleteCar(idcarrito).subscribe(() => {
      this.arrayCarritos = this.arrayCarritos.filter((user: any) => user.idcarrito !== idcarrito);
      this.calculateTotalPrice();
    });
  }

  calculateTotalPrice() {
    this.totalPrice = this.arrayCarritos.reduce((sum: number, item: any) => {
        const price = parseFloat(item.precio); // Ensure the price is treated as a number
        const cantidad = parseInt(item.cantidad, 10) || 1; // Use 'cantidad' if available, default to 1
        return sum + (isNaN(price) ? 0 : price * cantidad); // Add the price multiplied by the quantity
    }, 0);
}

  seguirComprando() {
    this.router.navigate(['/productos']); // Navigate to the products page
  }

  comprar(): void {
    localStorage.setItem('cartItems', JSON.stringify(this.arrayCarritos)); // Save cart items to localStorage
    this.router.navigate(['/ventas']); // Navigate to the "Ventas" component
  }

  updateCantidad(item: any) {
    const updatedItem = {
        idcarrito: item.idcarrito,
        cantidad: item.cantidad
    };

    this.productosService.updateCarritoCantidad(updatedItem).subscribe({
        next: () => {
            this.calculateTotalPrice(); // Recalculate the total price after updating the quantity
        },
        error: (error) => {
            console.error('Error al actualizar la cantidad del producto:', error);
            alert('Hubo un problema al actualizar la cantidad del producto.');
        }
    });
}
}