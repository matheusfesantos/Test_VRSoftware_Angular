// product-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { StoreService } from '../../services/store.service';
import { Product } from '../../models/product.model';
import { Store } from '../../models/store.model';
import { MatDialog } from '@angular/material/dialog';
import { PriceDialogComponent } from '../price-dialog/price-dialog.component';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  isEditMode = false;
  productId: number | null = null;
  stores: Store[] = [];
  prices: any[] = [];
  selectedFile: File | null = null;
  previewImage: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private storeService: StoreService,
    private dialog: MatDialog,
    private notificationService: NotificationService
  ) {
    this.productForm = this.fb.group({
      description: ['', [Validators.required, Validators.maxLength(60)]],
      cost: ['', [Validators.pattern(/^\d+\.?\d{0,3}$/)]],
      image: ['']
    });
  }

  ngOnInit(): void {
    this.loadStores();
    
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.productId = +params['id'];
        this.loadProduct(this.productId);
      }
    });
  }

  loadProduct(id: number): void {
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.productForm.patchValue({
          description: product.description,
          cost: product.cost
        });
        this.prices = product.prices;
        if (product.image) {
          this.previewImage = product.image;
        }
      },
      error: () => {
        this.notificationService.showError('Erro ao carregar produto');
      }
    });
  }

  loadStores(): void {
    this.storeService.getStores().subscribe({
      next: (stores) => {
        this.stores = stores;
      },
      error: () => {
        this.notificationService.showError('Erro ao carregar lojas');
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.type.match('image.*')) {
        this.selectedFile = file;
        
        const reader = new FileReader();
        reader.onload = () => {
          this.previewImage = reader.result;
        };
        reader.readAsDataURL(file);
      } else {
        this.notificationService.showError('Por favor, selecione apenas imagens (PNG ou JPG)');
      }
    }
  }

  openPriceDialog(priceData?: any): void {
    const dialogRef = this.dialog.open(PriceDialogComponent, {
      width: '500px',
      data: {
        stores: this.stores,
        prices: this.prices,
        priceData: priceData
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (priceData) {
          // Update existing price
          const index = this.prices.findIndex(p => p.storeId === result.storeId);
          if (index !== -1) {
            this.prices[index] = result;
          }
        } else {
          // Add new price
          const existingPriceIndex = this.prices.findIndex(p => p.storeId === result.storeId);
          if (existingPriceIndex !== -1) {
            this.notificationService.showError('Já existe um preço cadastrado para esta loja');
          } else {
            this.prices.push(result);
          }
        }
      }
    });
  }

  removePrice(storeId: number): void {
    this.prices = this.prices.filter(price => price.storeId !== storeId);
  }

  saveProduct(): void {
    if (this.productForm.invalid) {
      this.notificationService.showError('Preencha todos os campos obrigatórios corretamente');
      return;
    }

    if (this.prices.length === 0) {
      this.notificationService.showError('É necessário cadastrar pelo menos um preço de venda');
      return;
    }

    const productData = new FormData();
    productData.append('description', this.productForm.get('description')?.value);
    if (this.productForm.get('cost')?.value) {
      productData.append('cost', this.productForm.get('cost')?.value);
    }
    if (this.selectedFile) {
      productData.append('image', this.selectedFile);
    }
    
    // Add prices
    this.prices.forEach((price, index) => {
      productData.append(`prices[${index}][storeId]`, price.storeId.toString());
      productData.append(`prices[${index}][price]`, price.price.toString());
    });

    if (this.isEditMode && this.productId) {
      this.productService.updateProduct(this.productId, productData).subscribe({
        next: () => {
          this.notificationService.showSuccess('Produto atualizado com sucesso');
          this.router.navigate(['/produto']);
        },
        error: () => {
          this.notificationService.showError('Erro ao atualizar produto');
        }
      });
    } else {
      this.productService.createProduct(productData).subscribe({
        next: () => {
          this.notificationService.showSuccess('Produto criado com sucesso');
          this.router.navigate(['/produto']);
        },
        error: () => {
          this.notificationService.showError('Erro ao criar produto');
        }
      });
    }
  }

  deleteProduct(): void {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      if (this.productId) {
        this.productService.deleteProduct(this.productId).subscribe({
          next: () => {
            this.notificationService.showSuccess('Produto excluído com sucesso');
            this.router.navigate(['/produto']);
          },
          error: () => {
            this.notificationService.showError('Erro ao excluir produto');
          }
        });
      }
    }
  }
}