import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit {
  user: any = {};

  constructor(
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getUserById();
  }

  getUserById(): void {  
    const userId = this.authService.getUserData();

    if (userId) { 
      console.log('ID obtenido del AuthService:', userId);
      this.usuarioService.fetchUserById(userId).subscribe({
        next: (data) => {
          if (data) {
            this.user = data;
            console.log('Usuario cargado:', this.user);
          } else {
            console.error('Error: No se encontró el usuario.');
          }
        },
        error:(error)=> {
          console.error('Error al obtener el usuario:', error);
        }
      });
    } else {
      console.error('ID de usuario no proporcionado.');
    }
  }

  editUser(idusuarios: string) {
    this.router.navigate(['/edit-user', idusuarios]);
  }
}