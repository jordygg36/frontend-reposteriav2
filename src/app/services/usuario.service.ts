import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  URL = `${environment.apiUrl}/usuarios`;
  URL2 = `${environment.apiUrl}/register`;


  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    return this.authService.getAuthHeaders();
  }

  fetchUser(): Observable<any> {
    return this.http.get<any>(this.URL, { headers: this.getAuthHeaders() }).pipe(
      map(user => {
        if (user.imagen) {
          user.imagen = `${environment.apiUrl}/uploads/${user.imagen}`          
        }
        return user;
      })
    );
  }

  postUser(users: any): Observable<any> {
    const headers = this.authService.getAuthHeaders().delete('Content-Type');
    return this.http.post(this.URL, users, { headers });
  }

  updateUser(idusuarios: string, userData: FormData): Observable<any> {
    const headers = this.authService.getAuthHeaders().delete('Content-Type');
    return this.http.patch(`${this.URL}/${idusuarios}`, userData, { headers });
  }

  deleteUser(idusuarios: string): Observable<any> {
    return this.http.delete(`${this.URL}/${idusuarios}`, { headers: this.getAuthHeaders() }); 
  }

  fetchUserById(idusuarios: string): Observable<any> {
    return this.http.get<any>(`${this.URL}/${idusuarios}`, { headers: this.getAuthHeaders() }).pipe(
      map(user => {
        if (user.imagen) {
          user.imagen = `${environment.apiUrl}/uploads/${user.imagen}`          
        }
        return user;
      })
    );
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.URL}/login`, credentials, { headers: this.getAuthHeaders() });
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token'); 
  }

  registerUser(users: FormData): Observable<any> {
    const headers = this.authService.getAuthHeaders().delete('Content-Type');
    return this.http.post(this.URL2, users, { headers });
  }

  getUserById(userId: string): Observable<any> {
    return this.http.get<any>(`${this.URL}/${userId}`);
  }

  getUserDetails(userId: string): Observable<any> {
    console.log('Fetching user details for ID:', userId); // Log the user ID
    return this.http.get<any>(`https://backend-reposteria-2r9n.onrender.com/usuarios/details/${userId}`);
  }
}

