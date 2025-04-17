// product-list.component.ts
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  filters = {
    id: '',
    description: '',
    cost: '',
    salePrice: ''
  };
  isLoading = true;

  constructor(
    private productService: ProductService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = [...products];
        this.isLoading = false;
      },
      error: (err) => {
        this.notificationService.showError('Erro ao carregar produtos');
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredProducts = this.products.filter(product => {
      return (
        (this.filters.id ? product.id.toString().includes(this.filters.id) : true) &&
        (this.filters.description ? product.description.toLowerCase().includes(this.filters.description.toLowerCase()) : true) &&
        (this.filters.cost ? product.cost?.toString().includes(this.filters.cost) : true) &&
        (this.filters.salePrice ? 
          product.prices.some(price => price.price.toString().includes(this.filters.salePrice)) : 
          true)
      );
    });
  }

  clearFilters(): void {
    this.filters = {
      id: '',
      description: '',
      cost: '',
      salePrice: ''
    };
    this.filteredProducts = [...this.products];
  }

  editProduct(productId: number): void {
    this.router.navigate(['/produto/cadastro', productId]);
  }

  deleteProduct(productId: number): void {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      this.productService.deleteProduct(productId).subscribe({
        next: () => {
          this.notificationService.showSuccess('Produto excluído com sucesso');
          this.loadProducts();
        },
        error: () => {
          this.notificationService.showError('Erro ao excluir produto');
        }
      });
    }
  }

  addNewProduct(): void {
    this.router.navigate(['/produto/cadastro']);
  }
}