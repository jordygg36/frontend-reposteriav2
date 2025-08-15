import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductosService } from '../../services/productos.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {
  product: any = {}; // Store product details
  selectedFile: File | null = null; // Store the selected file
  errorMessage: string = '';
  successMessage: string = '';
  previewUrl: string | null = null;
  constructor(
    private productosService: ProductosService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getProductById();
  }

  getProductById(): void {
    const idproductos = this.route.snapshot.paramMap.get('idproductos'); // Get product ID from route
    if (idproductos) {
      this.productosService.fetchProductById(idproductos).subscribe({
        next: (data) => {
          this.product = data;


          if (this.product.fecha_creacion) {
            const date = new Date(this.product.fecha_creacion);
            this.product.fecha_creacion = date.toISOString().split('T')[0]; // Extract only the date part
          }
          if (data) {
            this.product = data;
            if (data.imagen) {
              this.previewUrl = data.imagen;
            }
          } else {
            console.error('Usuario no encontrado.');
          }

        },
        error: (error) => {
          console.error('Error al obtener el producto:', error);
          this.errorMessage = 'Error al cargar los detalles del producto.';
        }
      });
    } else {
      console.error('ID de producto no proporcionado.');
      this.errorMessage = 'ID de producto no válido.';
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onUpdate() {
    if (!this.product || !this.product.idproductos) {
      console.error('ID de producto no disponible para actualización.');
      this.errorMessage = 'ID de producto no válido.';
      return;
    }

    const formData = new FormData();
    formData.append('nombre', this.product.nombre);
    formData.append('descripcion', this.product.descripcion);
    formData.append('precio', this.product.precio);
    formData.append('fecha_creacion', this.product.fecha_creacion);

    if (this.selectedFile) {
      formData.append('imagen', this.selectedFile, this.selectedFile.name);
    }

    this.productosService.updateProduct(this.product.idproductos, formData).subscribe({
      next: () => {
        this.router.navigate(['/productos-lista']);// Redirect after 2 seconds
      },
      error: (error) => {
        console.error('Error al actualizar el producto:', error);
        this.errorMessage = 'Hubo un problema al actualizar el producto.';
      }
    });
  }
}
