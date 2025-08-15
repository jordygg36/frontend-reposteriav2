import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductosService } from '../../services/productos.service';
import { CommonModule } from '@angular/common'; // Import CommonModule
import * as CryptoJS from 'crypto-js'; // Import CryptoJS

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule], // Add CommonModule to imports
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent implements OnInit {
  items: any[] = [];
  total: number = 0;
  invoiceId: number | null = null; // Add the invoiceId property

  constructor(private productosService: ProductosService, private router: Router) {}

  ngOnInit(): void {
    const storedItems = localStorage.getItem('cartItems');
    if (storedItems) {
      this.items = JSON.parse(storedItems).map((item: any) => ({ // Explicitly define 'item' as 'any'
        ...item,
        cantidad: item.cantidad || 1, // Default to 1 if undefined
        precio_unitario: item.precio || 0 // Default to 0 if undefined
      }));
      this.calculateTotal();
    }
  }

  calculateTotal(): void {
    this.total = this.items.reduce((sum, item) => sum + item.cantidad * item.precio_unitario, 0);
  }

  generateInvoice(): void {
    const encryptedId = localStorage.getItem('userId'); // Get the encrypted user ID
    if (!encryptedId) {
        alert('Usuario no autenticado');
        return;
    }

    // Decrypt the user ID
    const bytes = CryptoJS.AES.decrypt(encryptedId, 'secret-key');
    const idusuarios = bytes.toString(CryptoJS.enc.Utf8);

    if (!idusuarios) {
        alert('Error al desencriptar el ID del usuario');
        return;
    }

    // Ensure the items array is correctly structured
    const invoiceData = {
        idusuarios,
        items: this.items.map(item => ({
            idproductos: item.idproductos,
            cantidad: item.cantidad || 1, // Default to 1 if undefined
            precio_unitario: item.precio || 0 // Default to 0 if undefined
        }))
    };

    console.log('Data sent to backend:', invoiceData); // Log the data being sent

    this.productosService.generateInvoice(invoiceData).subscribe({
        next: (response: any) => {
            this.invoiceId = response.idfactura; // Set the invoiceId when the invoice is generated
            alert('Factura generada con éxito');
        },
        error: (error: any) => {
            console.error('Error al generar la factura:', error);
            alert('Hubo un problema al generar la factura');
        }
    });
  }

  downloadInvoice(idfactura: number): void {
    const token = localStorage.getItem('jwtToken'); // Retrieve the token from localStorage
    if (!token) {
        alert('Token no encontrado. Por favor, inicie sesión nuevamente.');
        return;
    }

    const url = `http://localhost:5000/factura/${idfactura}/pdf`; // Ensure this URL matches the backend
    const headers = new Headers({ Authorization: `Bearer ${token}` });

    fetch(url, { headers })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al descargar la factura');
            }
            return response.blob();
        })
        .then(blob => {
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = `factura_${idfactura}.pdf`;
            link.click();
        })
        .catch(error => {
            console.error('Error al descargar la factura:', error);
            alert('Hubo un problema al descargar la factura.');
        });
  }
}
