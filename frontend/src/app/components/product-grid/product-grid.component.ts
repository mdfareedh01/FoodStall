import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../services/mock-data.service';
import { ProductCardComponent } from '../product-card/product-card.component';
import { staggerList } from '../../animations';

@Component({
  selector: 'app-product-grid',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  animations: [staggerList],
  template: `
    <div [@staggerList]="products.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      @for (product of products; track product.id) {
        <app-product-card 
          [product]="product" 
          (addToCart)="addToCart.emit($event)"
        ></app-product-card>
      }
    </div>
  `
})
export class ProductGridComponent {
  @Input({ required: true }) products: Product[] = [];
  @Output() addToCart = new EventEmitter<Product>();
}
