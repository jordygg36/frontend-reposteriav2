import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,

  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports:[CommonModule, FormsModule]
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.authService.login(this.email, this.password).subscribe(
      (response) => {
       
        this.authService.saveToken(response.token);
        this.router.navigate(['/dashboard']);  
      },
      (error) => {
        this.errorMessage = 'Credenciales incorrectas';
      }
    );
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']); // Navigate to the registration page
  }
}
