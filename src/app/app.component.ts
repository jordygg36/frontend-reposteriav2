import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgZone } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { UsuarioService } from './services/usuario.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = "noveno";
  isAuthenticated = false;
  userRole: number | null = null;
  userId: string | null = null;
  userName: string | null = null;

  constructor(private authService: AuthService, private router: Router, private ngZone: NgZone, private usuarioService: UsuarioService) { }

  ngOnInit() {
    this.authService.isAuthenticated$.subscribe(status => {
      this.ngZone.run(() => {
        this.isAuthenticated = status;
        this.userRole = this.authService.getRole();
        this.userId = this.authService.getUserData();
        console.log(this.userId);
        console.log(this.userRole);
        const userId = this.authService.getUserData(); // Get the authenticated user's ID
        console.log('Authenticated user ID:', userId); // Log the user ID
        if (userId) {
          this.fetchUserDetails(userId);
        }

      });
    });
  }
  perfil(idusuarios: string | null): void {
    console.log('Navegando al perfil con ID:', idusuarios);
    if (!idusuarios) {
      console.error('Error: idusuarios no definido');
      return;
    }
    this.router.navigate(['/perfil', idusuarios]);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  fetchUserDetails(userId: string): void {
    this.usuarioService.getUserById(userId).subscribe({
      next: (user) => {
        console.log('Fetched user details:', user); // Log the fetched user details
        this.userName = user.nombre;
       
      },
      error: (error) => {
        console.error('Error fetching user details:', error); // Log any errors
      }
    });
  }
}
