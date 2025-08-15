import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductosService } from '../../services/productos.service';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import * as CryptoJS from 'crypto-js';
@Component({
  selector: 'app-crear-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-productos.component.html',
  styleUrls:  ['./crear-productos.component.css']
})
export class CrearProductosComponent {
  newProduct: any = {};
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  constructor(private productosService: ProductosService,  private route: ActivatedRoute,
    private router: Router) {}

  encryptId(id: string): string {
      try {
        return CryptoJS.AES.encrypt(id, 'secret-key').toString();
      } catch (error) {
        console.error('Error encrypting ID:', error);
        return '';
      }
    }

  addProduct() {

    const formData = new FormData();
    formData.append('nombre', this.newProduct.nombre);
    formData.append('descripcion', this.newProduct.descripcion);
    formData.append('precio', this.newProduct.precio);
    formData.append('fecha_creacion', this.newProduct.fecha_creacion);
    if (this.selectedFile) {
      formData.append('imagen', this.selectedFile, this.selectedFile.name);
    }


    for (let pair of (formData as any).entries()) {
      console.log(pair[0]+ ':', pair[1]);
    }

    this.productosService.postProduct(formData).subscribe({
      next: (response) => {
        
        console.log('Producto agregado:', response);
        this.router.navigate(['/productos-lista']);
      },
      error: (error) => {
        console.error('Error al agregar el producto:', error);
      }
    });
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
}