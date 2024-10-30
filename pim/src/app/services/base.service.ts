import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  private apiUrl = '127.0.0.1:5000';

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`);
  }

  login(email: string, password: string): Observable<any> {
    const body = { email, password };
    return this.http.post<any>(`${this.apiUrl}/login`, body);
  }

  register(username: string, email: string, password: string): Observable<any> {
    const body = { username, email, password };
    return this.http.post<any>(`${this.apiUrl}/register`, body);
  }
}
