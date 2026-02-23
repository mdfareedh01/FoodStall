import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartStore } from '../../store/cart.store';
import { HlmButtonDirective } from '../../ui/ui-button/ui-button.directive';
import { LucideAngularModule, Trash2, Minus, Plus, Loader2, ShoppingCart } from 'lucide-angular';
import { Router, RouterLink } from '@angular/router';
import { EmptyStateComponent } from '../../components/empty-state/empty-state.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, HlmButtonDirective, LucideAngularModule, RouterLink, EmptyStateComponent],
  template: `
    <div class="container py-8 max-w-4xl">
      <h1 class="text-3xl font-bold mb-8">Shopping Cart</h1>

      @if (cartStore.items().length > 0) {
        <div class="grid gap-8">
          <div class="border rounded-lg bg-card text-card-foreground shadow-sm overflow-hidden">
            <div class="p-0 overflow-x-auto">
              <table class="w-full text-sm text-left">
                <thead class="bg-muted text-muted-foreground uppercase font-medium">
                  <tr>
                    <th class="px-6 py-4">Product</th>
                    <th class="px-6 py-4">Price</th>
                    <th class="px-6 py-4">Quantity</th>
                    <th class="px-6 py-4">Total</th>
                    <th class="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-border">
                  @for (item of cartStore.items(); track item.product.id) {
                    <tr class="hover:bg-muted/5">
                      <td class="px-6 py-4 font-medium flex items-center gap-4">
                        <img [src]="item.product.image" class="h-12 w-12 rounded object-cover bg-muted" alt="" />
                        {{ item.product.title }}
                      </td>
                      <td class="px-6 py-4">{{ item.product.price | currency:'INR':'symbol':'1.2-2' }}</td>
                      <td class="px-6 py-4">
                        <div class="flex items-center gap-2">
                          <button hlmBtn variant="outline" size="icon" class="h-8 w-8" (click)="cartStore.updateQuantity(item.product.id, item.quantity - 1)">
                            <lucide-icon [img]="Minus" class="h-3 w-3"></lucide-icon>
                          </button>
                          <span class="w-8 text-center font-medium">{{ item.quantity }}</span>
                          <button hlmBtn variant="outline" size="icon" class="h-8 w-8" (click)="cartStore.updateQuantity(item.product.id, item.quantity + 1)">
                            <lucide-icon [img]="Plus" class="h-3 w-3"></lucide-icon>
                          </button>
                        </div>
                      </td>
                      <td class="px-6 py-4 font-bold">
                        {{ item.product.price * item.quantity | currency:'INR':'symbol':'1.2-2' }}
                      </td>
                      <td class="px-6 py-4 text-right">
                        <button hlmBtn variant="ghost" size="icon" class="text-destructive hover:text-destructive hover:bg-destructive/10" (click)="cartStore.removeFromCart(item.product.id)">
                          <lucide-icon [img]="Trash2" class="h-4 w-4"></lucide-icon>
                        </button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
 
          <div class="flex flex-col md:flex-row justify-end gap-6 items-start md:items-center">
             <div class="text-right space-y-1">
                <p class="text-sm text-muted-foreground">Subtotal</p>
                <p class="text-3xl font-bold">{{ cartStore.total() | currency:'INR':'symbol':'1.2-2' }}</p>
             </div>
             <a routerLink="/checkout" hlmBtn size="lg" class="w-full md:w-auto">
                Proceed to Checkout
             </a>
          </div>
        </div>
      } @else {
        <app-empty-state
          [icon]="ShoppingCart"
          title="Your cart is empty"
          description="Looks like you haven't added anything yet."
          actionLabel="Start Shopping"
          actionLink="/"
        ></app-empty-state>
      }
    </div>
  `
})
export class CartComponent {
  cartStore = inject(CartStore);
  router = inject(Router);

  readonly Trash2 = Trash2;
  readonly Minus = Minus;
  readonly Plus = Plus;
  readonly ShoppingCart = ShoppingCart;
}
