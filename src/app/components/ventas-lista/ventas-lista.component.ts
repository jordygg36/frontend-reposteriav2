import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ventas-lista',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ventas-lista.component.html',
  styleUrls: ['./ventas-lista.component.css']
})
export class VentasListaComponent implements OnInit {
  ventas: any[] = []; // Store all sales data
  filteredVentas: any[] = []; // Store filtered sales data
  searchQuery: string = ''; // Search query

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchVentas();
  }

  fetchVentas(): void {
    this.http.get<any[]>('http://localhost:5000/ventas').subscribe({
      next: (data) => {
        this.ventas = data;
        this.filteredVentas = data; // Initialize filteredVentas with all sales
      },
      error: (error) => {
        console.error('Error al obtener las ventas:', error);
      }
    });
  }

  filterVentas(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredVentas = this.ventas.filter((venta) =>
      venta.usuario.toLowerCase().includes(query) ||
      venta.producto.toLowerCase().includes(query) ||
      venta.idfactura.toString().includes(query) ||
      venta.fecha.toLowerCase().includes(query)
    );
  }
}
