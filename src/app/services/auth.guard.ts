import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const isAuthenticated = this.authService.hasToken(); // Cambiado a `hasToken()` para verificar autenticación
    const requiredRole = route.data['role'] as number;


    const userRole = this.authService.getRole();
    

    if (isAuthenticated) {
      // Si no hay un rol requerido, simplemente deja pasar
      if (!requiredRole || userRole === requiredRole) {
        return true;
      }
    }
    
    this.router.navigate(['/login']);  
    return false;
  }
}
