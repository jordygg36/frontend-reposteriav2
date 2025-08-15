import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user: any = {
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    direccion: '',
    idrol: '3' // Default role for a regular user
  };
  selectedFile: File | null = null;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onSubmit(): void {
    const formData = new FormData();
    formData.append('nombre', this.user.nombre);
    formData.append('apellido', this.user.apellido);
    formData.append('email', this.user.email);
    formData.append('password', this.user.password);
    formData.append('direccion', this.user.direccion);
    formData.append('idrol', this.user.idrol);

    if (this.selectedFile) {
      formData.append('imagen', this.selectedFile, this.selectedFile.name);
    }

    this.usuarioService.registerUser(formData).subscribe({
      next: () => {
        this.successMessage = 'Usuario registrado con éxito.';
        setTimeout(() => this.router.navigate(['/login']), 2000); // Redirect to login after 2 seconds
      },
      error: (error) => {
        console.error('Error al registrar usuario:', error);
        this.errorMessage = 'Hubo un problema al registrar el usuario.';
      }
    });
  }
}
