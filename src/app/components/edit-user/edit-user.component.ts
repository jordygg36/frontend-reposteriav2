import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  user: any = {}; 
  selectedFile: File | null = null;
  previewUrl: string | null = null; 
  constructor(
    private usuarioService: UsuarioService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getUserById();
  }

  getUserById() {
    const idusuarios = this.route.snapshot.paramMap.get('idusuarios'); 
    if (idusuarios) { 
      this.usuarioService.fetchUserById(idusuarios).subscribe({
        next: (data) => {
        if (data) {
          this.user = data;
          if (data.imagen) {
            this.previewUrl = data.imagen; 
          }
        } else {
          console.error('Usuario no encontrado.');
        }
      },
      error: (error) => {
        console.error('Error al obtener usuario:', error);
      }
      });
    }else {
      console.error('ID de usuario no proporcionado.');
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
    if (!this.user || !this.user.idusuarios) {
      console.error('ID de usuario no disponible para actualización.');
      return;
    }
    const formData = new FormData();
    formData.append('nombre', this.user.nombre);
    formData.append('apellido', this.user.apellido);
    formData.append('idrol', this.user.idrol);
    formData.append('direccion', this.user.direccion);
    formData.append('email', this.user.email);
    formData.append('password', this.user.password);
    
    if (this.selectedFile) {
      formData.append('imagen', this.selectedFile, this.selectedFile.name);
    }

    this.usuarioService.updateUser(this.user.idusuarios, formData).subscribe({
      next: () => {
        this.router.navigate(['/perfil']);
      },
      error: (error) => {
        console.error('Error al actualizar usuario:', error);
      }
    });
  }
}
