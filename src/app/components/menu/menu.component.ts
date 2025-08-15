import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { ProductosService } from '../../services/productos.service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule], // Add CommonModule, FormsModule, and RouterModule to imports
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {
  products: any[] = []; // Store fetched products
  currentSlide: number = 0; // Track the current slide index

  constructor(private productosService: ProductosService) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.productosService.fetchProduct().subscribe({
      next: (response) => {
        this.products = response;
      },
      error: (error) => {
        console.error('Error fetching products:', error);
      }
    });
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.products.length; // Move to the next slide
  }

  prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.products.length) % this.products.length; // Move to the previous slide
  }
}
