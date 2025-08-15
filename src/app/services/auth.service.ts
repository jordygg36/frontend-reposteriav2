import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `https://backend-reposteria-2r9n.onrender.com/login`;  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    const token = this.getToken();
    this.isAuthenticatedSubject.next(!!token);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { email, password }).pipe(
      tap(response => {
        if (response.token && response.user?.idrol && response.user?.idusuarios) {
          this.saveToken(response.token);
          this.saveRole(response.user.idrol);
          this.saveUserId(response.user.idusuarios);

          this.isAuthenticatedSubject.next(true); 
          console.log('Token recibido y guardado:', response.token); 
          this.router.navigate(['/perfil']);
        }
      })
    );
  }

  logout(): void {
    if (this.isPlatformBrowser()) {
      this.clearToken();
      this.clearRole();
      this.clearUserId();

      localStorage.removeItem('user');
    }
    this.isAuthenticatedSubject.next(false); 
  }

  saveToken(token: string): void {
    if (this.isPlatformBrowser()) {
      localStorage.setItem('jwtToken', token); 
    }
  }

  saveRole(role: number): void {
    if (this.isPlatformBrowser()) {
      const encryptedRole = CryptoJS.AES.encrypt(role.toString(), 'secret-key').toString();
      localStorage.setItem('userRole', encryptedRole);
    }
  }

  saveUserId(userId: number): void {
    if (this.isPlatformBrowser()) {
      const encryptedUserId = CryptoJS.AES.encrypt(userId.toString(), 'secret-key').toString();
      localStorage.setItem('userId', encryptedUserId);
    }
  }

  clearToken(): void {
    if (this.isPlatformBrowser()) {
      localStorage.removeItem('jwtToken'); 
    }
  }

  clearRole(): void {
    if (this.isPlatformBrowser()) {
      localStorage.removeItem('userRole');
    }
  }

  clearUserId(): void {
    if (this.isPlatformBrowser()) {
      localStorage.removeItem('userId');
    }
  }

  getToken(): string | null {
    return this.isPlatformBrowser() ? localStorage.getItem('jwtToken') : null;
  }

  getRole(): number | null {
    const encryptedRole = this.isPlatformBrowser() ? localStorage.getItem('userRole') : null;
    if (encryptedRole) {
      const bytes = CryptoJS.AES.decrypt(encryptedRole, 'secret-key');
      const decryptedRole = bytes.toString(CryptoJS.enc.Utf8);
      return decryptedRole ? parseInt(decryptedRole, 10) : null;
    }
    return null;
  }

  getUserData(): string | null {
    const encryptedUserId = this.isPlatformBrowser() ? localStorage.getItem('userId') : null;
    if (encryptedUserId) {
      const bytes = CryptoJS.AES.decrypt(encryptedUserId, 'secret-key');
      return bytes.toString(CryptoJS.enc.Utf8);
    }
    return null;
  }

  getUserName(): string | null {
    const encryptedUser = this.isPlatformBrowser() ? localStorage.getItem('user') : null;
    if (encryptedUser) {
      const bytes = CryptoJS.AES.decrypt(encryptedUser, 'secret-key');
      return bytes.toString(CryptoJS.enc.Utf8);
    }
    return null;
  }

  hasToken(): boolean {
    return !!this.getToken(); 
  }

  private isPlatformBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : new HttpHeaders();
  }
}
