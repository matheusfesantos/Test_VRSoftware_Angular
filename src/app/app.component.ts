import { Component, OnInit } from '@angular/core';
import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  public data: string = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    // Chama o serviço para pegar dados da API
    this.apiService.getHello().subscribe(
      (response) => {
        this.data = response;
      },
      (error) => {
        console.error('Erro ao obter dados:', error);
      }
    );
  }
}