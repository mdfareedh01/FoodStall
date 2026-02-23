import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderStore } from '../../store/order.store';
import { HlmCardDirective, HlmCardHeaderDirective, HlmCardTitleDirective, HlmCardContentDirective } from '../../ui/ui-card/ui-card.directive';
import { LucideAngularModule, Package } from 'lucide-angular';
import { EmptyStateComponent } from '../../components/empty-state/empty-state.component';
import { SkeletonComponent } from '../../ui/ui-skeleton/ui-skeleton.component';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    HlmCardDirective,
    HlmCardHeaderDirective,
    HlmCardTitleDirective,
    HlmCardContentDirective,
    LucideAngularModule,
    EmptyStateComponent,
    SkeletonComponent
  ],
  template: `
    <div class="container py-8 max-w-4xl">
      <h1 class="text-3xl font-bold mb-8">My Orders</h1>
      
      @if (orderStore.loading()) {
        <div class="space-y-6">
          @for (i of [1,2,3]; track i) {
            <div hlmCard>
              <div hlmCardHeader class="flex flex-row items-center justify-between border-b bg-muted/20 pb-4">
                <div class="space-y-2">
                  <app-skeleton class="h-6 w-32"></app-skeleton>
                  <app-skeleton class="h-4 w-48"></app-skeleton>
                </div>
                <app-skeleton class="h-8 w-20"></app-skeleton>
              </div>
              <div hlmCardContent class="pt-6 space-y-4">
                <app-skeleton class="h-12 w-full"></app-skeleton>
                <app-skeleton class="h-12 w-full"></app-skeleton>
              </div>
            </div>
          }
        </div>
      } @else if (orderStore.orders().length > 0) {
        <div class="space-y-6">
          @for (order of orderStore.orders(); track order.id) {
            <div hlmCard>
              <div hlmCardHeader class="flex flex-row items-center justify-between border-b bg-muted/20 pb-4">
                <div class="space-y-1">
                  <p hlmCardTitle class="text-lg">Order #{{ order.id }}</p>
                  <p class="text-sm text-muted-foreground">{{ order.createdAt | date:'medium' }}</p>
                </div>
                <div class="text-right flex flex-col items-end gap-2">
                  <p class="text-lg font-bold">{{ order.total | currency:'INR':'symbol':'1.2-2' }}</p>
                  <div class="flex flex-col items-end gap-2">
                    <span 
                      class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium uppercase tracking-wider"
                      [ngClass]="{
                        'bg-amber-100 text-amber-800': order.status === 'pending',
                        'bg-green-100 text-green-800': order.status === 'completed',
                        'bg-destructive/10 text-destructive': order.status === 'cancelled'
                      }"
                    >
                      {{ order.status === 'pending' ? 'Initiated' : (order.status === 'completed' ? 'Delivered' : 'Cancelled') }}
                    </span>
                    @if (order.status === 'pending') {
                      <button hlmBtn variant="ghost" size="sm" class="h-7 text-[10px] text-destructive hover:text-white hover:bg-destructive px-3 rounded-full border border-destructive/20 font-black uppercase tracking-widest transition-all" (click)="cancelOrder(order.id)">
                        Cancel Order
                      </button>
                    }
                  </div>
                </div>
              </div>
              <div hlmCardContent class="pt-6">
                <ul class="divide-y divide-border">
                  @for (item of order.items; track item.product.id) {
                    <li class="py-4 flex items-center justify-between">
                      <div class="flex items-center gap-4">
                        <img [src]="item.product.image" class="h-12 w-12 rounded object-cover" alt="" />
                        <div>
                          <p class="font-medium">{{ item.product.title }}</p>
                          <p class="text-sm text-muted-foreground">Qty: {{ item.quantity }} × {{ item.product.price | currency:'INR':'symbol':'1.2-2' }}</p>
                        </div>
                      </div>
                      <p class="font-medium">{{ (item.product.price * item.quantity) | currency:'INR':'symbol':'1.2-2' }}</p>
                    </li>
                  }
                </ul>
              </div>
            </div>
          }
        </div>
      } @else {
        <app-empty-state
          [icon]="Package"
          title="No orders yet"
          description="When you place an order, it will appear here."
          actionLabel="Start Shopping"
          actionLink="/"
        ></app-empty-state>
      }
    </div>
  `
})
export class OrdersComponent {
  orderStore = inject(OrderStore);
  readonly Package = Package;

  cancelOrder(orderId: string) {
    if (confirm('Are you sure you want to cancel this order?')) {
      this.orderStore.cancelOrder(orderId);
    }
  }
}
