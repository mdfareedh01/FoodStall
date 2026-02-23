import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../services/mock-data.service';
import { ProductGridComponent } from '../../components/product-grid/product-grid.component';
import { CartStore } from '../../store/cart.store';
import { ProductStore } from '../../store/product.store';
import { HlmCardDirective, HlmCardHeaderDirective, HlmCardTitleDirective, HlmCardContentDirective } from '../../ui/ui-card/ui-card.directive';
import { HlmButtonDirective } from '../../ui/ui-button/ui-button.directive';
import { HlmBadgeDirective } from '../../ui/ui-badge/ui-badge.directive';
import { LucideAngularModule, Filter, X, ChevronDown, Zap, Sprout, Home } from 'lucide-angular';
import { SkeletonComponent } from '../../ui/ui-skeleton/ui-skeleton.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ProductGridComponent,
    HlmCardDirective,
    HlmCardHeaderDirective,
    HlmCardTitleDirective,
    HlmCardContentDirective,
    HlmButtonDirective,
    HlmBadgeDirective,
    LucideAngularModule,
    SkeletonComponent
  ],
  template: `
    <div class="container py-6 px-4 sm:px-8">
      <div class="flex flex-col md:flex-row gap-8">
        <!-- Desktop Sidebar -->
        <aside class="hidden md:block w-64 space-y-6">
          <div hlmCard>
            <div hlmCardHeader>
              <div hlmCardTitle class="text-lg">Filters</div>
            </div>
            <div hlmCardContent class="space-y-4">
              <div class="flex items-center space-x-2">
                <input type="checkbox" id="vegOnly" [ngModel]="isVegOnly()" (ngModelChange)="isVegOnly.set($event)" class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                <label for="vegOnly" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-100 flex items-center gap-2 cursor-pointer">
                  <span hlmBadge class="h-2 w-2 rounded-full bg-green-600 p-0 border-none"></span>
                  Vegetarian Only
                </label>
              </div>
            </div>
          </div>
        </aside>

        <!-- Mobile Filter Bar (Sticky) -->
        <div class="md:hidden sticky top-[56px] z-40 bg-background/95 backdrop-blur py-3 border-b -mx-4 px-4 flex items-center justify-between mb-4">
          <button 
            hlmBtn variant="outline" size="sm" 
            class="flex items-center gap-2 rounded-full"
            (click)="isFilterSheetOpen.set(true)"
          >
            <lucide-icon [img]="FilterIcon" class="h-4 w-4"></lucide-icon>
            Filters
            @if (isVegOnly()) {
              <span class="ml-1 h-2 w-2 rounded-full bg-primary"></span>
            }
          </button>
          
          <div class="text-xs text-muted-foreground font-medium">
            {{ filteredProducts().length }} items found
          </div>
        </div>

        <!-- Product Grid Content -->
        <main class="flex-1">
          <div class="hidden md:flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold">Recommended for you</h2>
            <div class="flex items-center gap-2 text-sm text-muted-foreground">
               <lucide-icon [img]="FilterIcon" class="h-4 w-4"></lucide-icon>
               Showing {{ filteredProducts().length }} items
            </div>
          </div>

          @if (productStore.loading()) {
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              @for (i of [1,2,3,4,5,6]; track i) {
                <div class="space-y-4">
                  <app-skeleton class="aspect-[4/3] w-full rounded-2xl"></app-skeleton>
                  <div class="space-y-2">
                    <app-skeleton class="h-6 w-3/4"></app-skeleton>
                    <app-skeleton class="h-4 w-1/2"></app-skeleton>
                  </div>
                </div>
              }
            </div>
          } @else {
            <div class="space-y-20">
              <!-- Today's Special Section -->
              @if(specialProducts().length > 0) {
              <section class="space-y-12">
                <div class="flex items-center gap-3 mb-2">
                  <div class="p-2 bg-amber-100 rounded-xl">
                    <lucide-icon [img]="Zap" class="h-6 w-6 text-amber-600 fill-amber-600"></lucide-icon>
                  </div>
                  <h3 class="text-2xl font-black tracking-tight underline cursor-default decoration-amber-400 decoration-4 underline-offset-8">Today's Special</h3>
                </div>
                <app-product-grid 
                  [products]="specialProducts()" 
                  (addToCart)="onAddToCart($event)"
                ></app-product-grid>
              </section>
              }

              <!-- Farm Fresh Section -->
              @if(farmProducts().length > 0) {
              <section class="space-y-12">
                <div class="flex items-center gap-3 mb-2">
                   <div class="p-2 bg-green-100 rounded-xl">
                    <lucide-icon [img]="Sprout" class="h-6 w-6 text-green-600"></lucide-icon>
                  </div>
                  <h3 class="text-2xl font-black tracking-tight underline cursor-default decoration-green-400 decoration-4 underline-offset-8">Farm Fresh Products</h3>
                </div>
                <app-product-grid 
                  [products]="farmProducts()" 
                  (addToCart)="onAddToCart($event)"
                ></app-product-grid>
              </section>
              }

              <!-- Homemade Section -->
              @if(homemadeProducts().length > 0) {
              <section class="space-y-12">
                <div class="flex items-center gap-3 mb-2">
                   <div class="p-2 bg-purple-100 rounded-xl">
                    <lucide-icon [img]="HomeIcon" class="h-6 w-6 text-purple-600"></lucide-icon>
                  </div>
                  <h3 class="text-2xl font-black tracking-tight underline cursor-default decoration-purple-400 decoration-4 underline-offset-8">Homemade Delicacies</h3>
                </div>
                <app-product-grid 
                  [products]="homemadeProducts()" 
                  (addToCart)="onAddToCart($event)"
                ></app-product-grid>
              </section>
              }

              <!-- Explore Our Full Menu Section (Always Visible) -->
              <section class="space-y-6 pt-12 border-t">
                 <div class="flex items-center justify-between">
                    <h3 class="text-2xl font-black tracking-tight text-foreground/80 lowercase">/ explore our full menu</h3>
                    <div class="h-px flex-1 bg-border/40 mx-6 hidden sm:block"></div>
                 </div>
                 <app-product-grid 
                  [products]="filteredProducts()" 
                  (addToCart)="onAddToCart($event)"
                ></app-product-grid>
              </section>
            </div>
          }
        </main>
      </div>
    </div>

    <!-- Mobile Filter Sheet -->
    <div 
      class="fixed inset-0 z-[70] md:hidden transition-all duration-300"
      [class.invisible]="!isFilterSheetOpen()"
    >
      <div 
        class="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        [class.opacity-0]="!isFilterSheetOpen()"
        [class.opacity-100]="isFilterSheetOpen()"
        (click)="isFilterSheetOpen.set(false)"
      ></div>

      <div 
        class="absolute inset-x-0 bottom-0 bg-background rounded-t-2xl shadow-2xl p-6 transition-transform duration-300 ease-in-out border-t"
        [class.translate-y-full]="!isFilterSheetOpen()"
        [class.translate-y-0]="isFilterSheetOpen()"
      >
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-bold">Filters</h3>
          <button hlmBtn variant="ghost" size="icon" (click)="isFilterSheetOpen.set(false)">
            <lucide-icon [img]="XIcon" class="h-5 w-5"></lucide-icon>
          </button>
        </div>

        <div class="space-y-6 pb-6">
          <div class="space-y-4">
            <h4 class="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Dietary Preference</h4>
            <div 
              class="flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer"
              [class.border-primary]="isVegOnly()"
              [class.bg-primary/5]="isVegOnly()"
              (click)="isVegOnly.set(!isVegOnly())"
            >
              <div class="flex items-center gap-3">
                <span hlmBadge class="h-3 w-3 rounded-full bg-green-600 p-0 border-none"></span>
                <span class="font-medium">Vegetarian Only</span>
              </div>
              <input type="checkbox" [checked]="isVegOnly()" class="h-5 w-5 rounded-full border-gray-300 text-primary focus:ring-primary pointer-events-none" />
            </div>
          </div>
        </div>

        <button hlmBtn class="w-full h-12 text-lg rounded-xl" (click)="isFilterSheetOpen.set(false)">
          Show {{ filteredProducts().length }} Items
        </button>
      </div>
    </div>
  `
})
export class HomeComponent {
  productStore = inject(ProductStore);
  private cartStore = inject(CartStore);

  isVegOnly = signal(false);
  isFilterSheetOpen = signal(false);

  filteredProducts = computed(() => {
    const prods = this.productStore.products();
    return this.isVegOnly() ? prods.filter(p => p.isVeg) : prods;
  });

  specialProducts = computed(() => {
    return this.filteredProducts().filter(p => p.isSpecial);
  });

  farmProducts = computed(() => {
    return this.filteredProducts().filter(p => p.origin === 'Farm');
  });

  homemadeProducts = computed(() => {
    return this.filteredProducts().filter(p => p.origin === 'Homemade');
  });

  onAddToCart(product: Product) {
    this.cartStore.addToCart(product);
  }

  readonly FilterIcon = Filter;
  readonly XIcon = X;
  readonly ChevronDown = ChevronDown;
  readonly Zap = Zap;
  readonly Sprout = Sprout;
  readonly HomeIcon = Home;
}
