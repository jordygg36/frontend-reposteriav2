import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './add-user.component.html', 
  styleUrls: ['./add-user.component.css'] 
})
export class AddUserComponent {
  newUser: any = {};
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  constructor(private usuarioService: UsuarioService, private route: ActivatedRoute,
    private router: Router) {
    
  }

  encryptId(id: string): string {
    try {
      return CryptoJS.AES.encrypt(id, 'secret-key').toString();
    } catch (error) {
      console.error('Error encrypting ID:', error);
      return '';
    }
  }

  addUser() {
    const formData = new FormData();
    formData.append('nombre', this.newUser.nombre);
    formData.append('apellido', this.newUser.apellido);
    formData.append('rfc', this.newUser.rfc);
    formData.append('email', this.newUser.email);
    formData.append('direccion', this.newUser.direccion);
    formData.append('idrol', this.newUser.idrol);
    formData.append('fecha_creacion', this.newUser.fecha_creacion);
    formData.append('password', this.newUser.password);
    if (this.selectedFile) {
      formData.append('imagen', this.selectedFile, this.selectedFile.name);
    }

    for (let pair of (formData as any).entries()) {
      console.log(pair[0]+ ': ' + pair[1]);
    }

    this.usuarioService.postUser(formData).subscribe({
      next: (response) => {
        console.log('Usuario agregado:', response);
        const encryptedId = this.encryptId(response.usuario.idusuarios.toString());
        this.router.navigate(['/usuario', encryptedId]);
      },
      error: (error) => {
        console.error('Error al agregar el usuario:', error);
      },
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
