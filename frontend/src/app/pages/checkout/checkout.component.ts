import { Component, inject, signal, computed, effect, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartStore } from '../../store/cart.store';
import { OrderStore } from '../../store/order.store';
import { UserStore } from '../../store/user.store';
import { HlmButtonDirective } from '../../ui/ui-button/ui-button.directive';
import { HlmInputDirective } from '../../ui/ui-input/ui-input.directive';
import { HlmCardDirective, HlmCardHeaderDirective, HlmCardTitleDirective, HlmCardContentDirective, HlmCardFooterDirective } from '../../ui/ui-card/ui-card.directive';
import { LucideAngularModule, CreditCard, Banknote, Smartphone, Loader2, MapPin, Phone, ChevronRight } from 'lucide-angular';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HlmButtonDirective,
    HlmInputDirective,
    HlmCardDirective,
    HlmCardHeaderDirective,
    HlmCardTitleDirective,
    HlmCardContentDirective,
    HlmCardFooterDirective,
    LucideAngularModule
  ],
  template: `
    <div class="min-h-screen bg-muted/30">
      <div class="container py-6 sm:py-8 px-4 sm:px-8 max-w-5xl">
        <h1 class="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Checkout</h1>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <!-- Delivery & Payment Section -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Delivery Address -->
            <div hlmCard class="shadow-sm border-none sm:border">
              <div hlmCardHeader>
                <div hlmCardTitle class="flex items-center gap-2 text-lg">
                  <lucide-icon [img]="MapPin" class="h-5 w-5 text-primary"></lucide-icon> Delivery Address
                </div>
              </div>
              <div hlmCardContent class="grid gap-4 sm:gap-6 pt-2">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="space-y-1.5">
                    <label class="text-xs font-bold uppercase tracking-wider text-muted-foreground">Full Name</label>
                    <input hlmInput [ngModel]="name()" (ngModelChange)="name.set($event)" placeholder="John Doe" class="w-full h-12 rounded-xl" />
                  </div>
                  <div class="space-y-1.5">
                    <label class="text-xs font-bold uppercase tracking-wider text-muted-foreground">Phone Number</label>
                    <input hlmInput [ngModel]="phone()" (ngModelChange)="phone.set($event)" placeholder="98765 43210" class="w-full h-12 rounded-xl" [class.border-destructive]="phoneError()" />
                    @if (phone() && phoneError()) {
                      <p class="text-[10px] text-destructive font-bold uppercase tracking-tight">{{ phoneError() }}</p>
                    }
                  </div>
                </div>
                <div class="space-y-1.5">
                  <label class="text-xs font-bold uppercase tracking-wider text-muted-foreground">Full Address</label>
                  <textarea hlmInput [ngModel]="street()" (ngModelChange)="street.set($event)" placeholder="House/Flat No, Street, Locality" class="w-full min-h-[120px] rounded-xl py-3"></textarea>
                </div>
              </div>
            </div>

            <!-- Payment Methods -->
            <div hlmCard class="shadow-sm border-none sm:border">
              <div hlmCardHeader>
                <div hlmCardTitle class="flex items-center gap-2 text-lg">
                  <lucide-icon [img]="Banknote" class="h-5 w-5 text-primary"></lucide-icon> Payment Method
                </div>
              </div>
              <div hlmCardContent class="grid gap-3 pt-2">
                <!-- COD -->
                <div 
                  class="flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all border-primary bg-primary/5 active:scale-[0.98]"
                >
                  <div class="flex items-center gap-4">
                    <div class="p-2 bg-primary/10 rounded-full">
                      <lucide-icon [img]="Banknote" class="h-6 w-6 text-primary"></lucide-icon>
                    </div>
                    <div>
                      <p class="font-bold">Cash On Delivery</p>
                      <p class="text-xs text-muted-foreground">Pay when your food arrives</p>
                    </div>
                  </div>
                  <div class="h-5 w-5 rounded-full border-2 border-primary flex items-center justify-center">
                    <div class="h-2.5 w-2.5 rounded-full bg-primary"></div>
                  </div>
                </div>

                <!-- UPI (Disabled) -->
                <div class="flex items-center justify-between p-4 border rounded-xl opacity-60 bg-muted/20 grayscale">
                  <div class="flex items-center gap-4">
                    <div class="p-2 bg-muted rounded-full">
                      <lucide-icon [img]="Smartphone" class="h-6 w-6 text-muted-foreground"></lucide-icon>
                    </div>
                    <div>
                      <p class="font-bold flex items-center gap-2">
                        UPI Payment 
                        <span class="text-[9px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground uppercase">Later</span>
                      </p>
                      <p class="text-xs text-muted-foreground">GPay, PhonePe, Paytm</p>
                    </div>
                  </div>
                </div>

                <!-- Card (Disabled) -->
                <div class="flex items-center justify-between p-4 border rounded-xl opacity-60 bg-muted/20 grayscale">
                  <div class="flex items-center gap-4">
                    <div class="p-2 bg-muted rounded-full">
                      <lucide-icon [img]="CreditCard" class="h-6 w-6 text-muted-foreground"></lucide-icon>
                    </div>
                    <div>
                      <p class="font-bold flex items-center gap-2">
                        Credit / Debit Card
                        <span class="text-[9px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground uppercase">Later</span>
                      </p>
                      <p class="text-xs text-muted-foreground">Visa, Mastercard, RuPay</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Summary Section -->
          <div class="space-y-6">
            <div hlmCard class="shadow-lg border-none sm:border sticky top-[100px]">
              <div hlmCardHeader>
                <div hlmCardTitle class="text-lg font-bold">Order Summary</div>
              </div>
              <div hlmCardContent class="space-y-4 pt-2">
                <div class="max-h-[300px] overflow-y-auto space-y-3 pr-2 scrollbar-thin">
                  @for (item of cartStore.items(); track item.product.id) {
                    <div class="flex justify-between items-center text-sm">
                      <div class="flex flex-col">
                        <span class="font-medium line-clamp-1">{{ item.product.title }}</span>
                        <span class="text-xs text-muted-foreground">{{ item.quantity }} × {{ item.product.price | currency:'INR':'symbol':'1.2-2' }}</span>
                      </div>
                      <span class="font-bold">{{ item.product.price * item.quantity | currency:'INR':'symbol':'1.2-2' }}</span>
                    </div>
                  }
                </div>
                
                <hr class="my-4 border-dashed" />
                
                <div class="space-y-2">
                  <div class="flex justify-between text-sm">
                    <span class="text-muted-foreground">Subtotal</span>
                    <span class="font-medium">{{ cartStore.total() | currency:'INR':'symbol':'1.2-2' }}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-muted-foreground">Delivery Partner Fee</span>
                    <span class="text-green-600 font-bold uppercase text-[10px] bg-green-50 px-2 py-0.5 rounded">Free</span>
                  </div>
                </div>
 
                <div class="flex justify-between items-center text-xl font-black border-t pt-4 mt-4">
                  <span class="text-foreground">Total</span>
                  <span class="text-primary">{{ cartStore.total() | currency:'INR':'symbol':'1.2-2' }}</span>
                </div>
              </div>
              <div hlmCardFooter class="pt-2">
                <button 
                  hlmBtn 
                  size="lg" 
                  class="w-full h-14 text-lg font-black rounded-2xl shadow-xl hover:shadow-primary/20 transition-all flex items-center justify-center gap-3" 
                  (click)="placeOrder()" 
                  [disabled]="isProcessing() || !isFormValid()"
                >
                  @if (isProcessing()) {
                    <lucide-icon [img]="Loader2" class="h-5 w-5 animate-spin"></lucide-icon>
                    Placing Order...
                  } @else {
                    Confirm Order
                    <lucide-icon [img]="ChevronRight" class="h-5 w-5"></lucide-icon>
                  }
                </button>
                <p class="text-[10px] text-center text-muted-foreground mt-4 w-full">
                  By clicking, you agree to our Terms and Conditions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CheckoutComponent implements OnInit {
  cartStore = inject(CartStore);
  orderStore = inject(OrderStore);
  userStore = inject(UserStore);
  router = inject(Router);

  isProcessing = signal(false);

  // Use signals for form fields to ensure reactivity
  name = signal(this.userStore.user()?.role === 'ADMIN' ? 'Admin User' : '');
  phone = signal(this.userStore.user()?.phoneNumber || '');
  street = signal('');

  isPhoneValid = computed(() => {
    const p = this.phone().replace(/\s/g, '');
    return /^[0-9]{10}$/.test(p);
  });

  phoneError = computed(() => {
    if (!this.phone()) return null;
    return this.isPhoneValid() ? null : 'Please enter a valid 10-digit number';
  });

  isFormValid = computed(() => !!(this.name() && this.isPhoneValid() && this.street()));

  ngOnInit() {
    console.log('[Checkout] Initializing. Cart items:', this.cartStore.items().length);
    if (this.cartStore.items().length === 0) {
      console.warn('[Checkout] Cart empty, redirecting.');
      this.router.navigate(['/']);
    }
  }

  constructor() {
    effect(() => {
      const loading = this.orderStore.loading();
      const error = this.orderStore.error();
      const processing = this.isProcessing();

      console.log('[Checkout] Store state effect:', { loading, error, processing });

      if (!loading && !error && processing) {
        console.log('[Checkout] Success! Clearing cart and navigating.');
        this.cartStore.clearCart();
        this.isProcessing.set(false);
        this.router.navigate(['/orders']);
      } else if (error && processing) {
        console.error('[Checkout] Error detected while processing:', error);
        this.isProcessing.set(false);
      }
    });
  }

  placeOrder() {
    console.log('[Checkout] placeOrder called. Form Valid:', this.isFormValid());

    if (!this.isFormValid()) {
      console.warn('[Checkout] Attempted to place order with invalid form');
      return;
    }

    this.isProcessing.set(true);

    const orderRequest = {
      customerPhone: this.phone(),
      items: this.cartStore.items().map(item => ({
        productId: item.product.id,
        quantity: item.quantity
      }))
    };

    console.log('[Checkout] Calling orderStore.placeOrder:', orderRequest);
    this.orderStore.placeOrder(orderRequest);
  }

  readonly CreditCard = CreditCard;
  readonly Banknote = Banknote;
  readonly Smartphone = Smartphone;
  readonly Loader2 = Loader2;
  readonly MapPin = MapPin;
  readonly PhoneIcon = Phone;
  readonly ChevronRight = ChevronRight;
}
