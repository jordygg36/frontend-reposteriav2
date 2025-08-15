import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule], // Add FormsModule here
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  user: any = [];
  filteredUsers: any = []; // Array for filtered users
  searchQuery: string = ''; // Search query

  constructor(public usuarioService: UsuarioService, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.fetch();
  }

  fetch() {
    this.usuarioService.fetchUser().subscribe({
      next: (data) => {
        if (data) {
          this.user = data;
          this.filteredUsers = data; // Initialize filteredUsers with all users
          console.log('Usuarios cargados:', this.user);
        } else {
          console.error('Error: No se encontraron usuarios.');
        }
      },
      error: (error) => {
        console.error('Error al obtener los usuarios:', error);
      }
    });
  }

  filterUsers() {
    const query = this.searchQuery.toLowerCase();
    this.filteredUsers = this.user.filter((item: any) =>
      item.nombre.toLowerCase().includes(query) ||
      item.apellido.toLowerCase().includes(query) ||
      item.email.toLowerCase().includes(query) ||
      item.direccion.toLowerCase().includes(query)
    );
  }

  addUser() {
    this.router.navigate(['/add-user']);
  }

  editUser(idusuarios: string) {
    this.router.navigate(['/edit-user', idusuarios]);
  }

  deleteUser(idusuarios: string) {
    this.usuarioService.deleteUser(idusuarios).subscribe(() => {
      this.user = this.user.filter((user: any) => user.idusuarios !== idusuarios);
      this.filterUsers(); // Update filteredUsers after deletion
    });
  }
}
