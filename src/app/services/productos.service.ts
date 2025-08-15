import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private URL = 'http://localhost:5000/productos';
  private URL2 = 'http://localhost:5000/carrito'; 

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    return this.authService.getAuthHeaders();
  }

  fetchProduct(): Observable<any> {
    return this.http.get<any>(this.URL, { headers: this.getAuthHeaders() }).pipe( 
      map(products => {
        if(products.imagen) {
          products.imagen = `http://localhost:5000/uploads/${products.imagen}`         
        }
        return products;
      })
    );
  }

  fetchCarrito(userId: string): Observable<any> {
    return this.http.get(`${this.URL2}?userId=${userId}`); 
  }

  
  postProduct(products: any): Observable<any> {
    const headers = this.authService.getAuthHeaders().delete('Content-Type');
    return this.http.post(this.URL, products, { headers });
  }

  postCarrito(products: any): Observable<any> {
    return this.http.post(this.URL2, products); // Ensure the payload includes 'cantidad'
  }

  updateProduct(idproductos: string, products: FormData): Observable<any> {
    const headers = this.authService.getAuthHeaders().delete('Content-Type');
    return this.http.patch(`${this.URL}/${idproductos}`, products, { headers });
  }

  deleteProduct(idproductos: string): Observable<any> {
    
    return this.http.delete(`${this.URL}/${idproductos}`, { headers: this.getAuthHeaders() });
  }

  deleteCar(idcarrito: string): Observable<any> {
    return this.http.delete(`${this.URL2}/${idcarrito}`);
  }

  fetchProductById(idproductos: string): Observable<any> {
    return this.http.get<any>(`${this.URL}/${idproductos}`, { headers: this.getAuthHeaders() }).pipe(
      map(product => {
        if (product.imagen) {
          product.imagen = `http://localhost:5000/uploads/${product.imagen}`          
        }
        return product;
      })
    );
  }

  generateInvoice(invoiceData: any): Observable<any> {
    const headers = this.authService.getAuthHeaders(); // Include authorization headers
    return this.http.post('http://localhost:5000/factura', invoiceData, { headers });
  }

  updateCarritoCantidad(item: any): Observable<any> {
    return this.http.patch(`${this.URL2}/${item.idcarrito}`, { cantidad: item.cantidad }, { headers: this.getAuthHeaders() });
  }
}
