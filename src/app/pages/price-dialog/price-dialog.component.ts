// price-dialog.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-price-dialog',
  templateUrl: './price-dialog.component.html',
  styleUrls: ['./price-dialog.component.scss']
})
export class PriceDialogComponent implements OnInit {
  priceForm: FormGroup;
  stores: any[] = [];
  prices: any[] = [];
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PriceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notificationService: NotificationService
  ) {
    this.stores = data.stores;
    this.prices = data.prices;
    this.priceForm = this.fb.group({
      storeId: ['', Validators.required],
      price: ['', [Validators.required, Validators.pattern(/^\d+\.?\d{0,3}$/)]]
    });

    if (data.priceData) {
      this.isEditMode = true;
      this.priceForm.patchValue(data.priceData);
    }
  }

  ngOnInit(): void {
    if (this.isEditMode) {
      // Filter out the current store in edit mode
      this.stores = this.stores.filter(store => 
        store.id === this.data.priceData.storeId || 
        !this.prices.some(price => price.storeId === store.id)
    } else {
      // Filter out stores that already have prices
      this.stores = this.stores.filter(store => 
        !this.prices.some(price => price.storeId === store.id)
    }
  }

  save(): void {
    if (this.priceForm.invalid) {
      this.notificationService.showError('Preencha todos os campos obrigatórios corretamente');
      return;
    }

    const formValue = this.priceForm.value;
    const selectedStore = this.stores.find(store => store.id === formValue.storeId);

    this.dialogRef.close({
      storeId: formValue.storeId,
      storeName: selectedStore.description,
      price: formValue.price
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}