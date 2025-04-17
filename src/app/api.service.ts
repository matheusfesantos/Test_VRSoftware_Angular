import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'https://test-vr-software.onrender.com'; // URL da sua API

  constructor(private http: HttpClient) {}

  // Método para obter dados da API (exemplo usando GET)
  getHello(): Observable<any> {
    return this.http.get(`${this.apiUrl}/hello`);
  }
}