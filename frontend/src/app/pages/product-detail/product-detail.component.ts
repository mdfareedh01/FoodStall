import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductStore } from '../../store/product.store';
import { CartStore } from '../../store/cart.store';
import { Product } from '../../services/mock-data.service';
import { HlmButtonDirective } from '../../ui/ui-button/ui-button.directive';
import { HlmBadgeDirective } from '../../ui/ui-badge/ui-badge.directive';
import { LucideAngularModule, Star, Check, ArrowLeft, Leaf, Utensils, Zap, Sprout, Home } from 'lucide-angular';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, HlmButtonDirective, HlmBadgeDirective, LucideAngularModule, RouterLink],
  template: `
    <div class="min-h-screen bg-background">
      <div class="container py-4 sm:py-8 px-4 sm:px-8">
        <a routerLink="/" class="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 sm:mb-6 transition-colors">
          <lucide-icon [img]="ArrowLeft" class="h-4 w-4"></lucide-icon>
          Back to Products
        </a>

        @if (productStore.loading()) {
          <div class="flex flex-col items-center justify-center py-20 text-muted-foreground">
             <div class="loader mb-4 border-4 border-primary/30 border-t-primary rounded-full w-8 h-8 animate-spin"></div>
             Loading details...
          </div>
        } @else if (productStore.selectedProduct(); as product) {
          <div class="grid md:grid-cols-2 gap-6 lg:gap-12">
            <!-- Image Section -->
            <div class="relative aspect-square sm:aspect-[4/3] md:aspect-auto md:h-[600px] overflow-hidden rounded-2xl border bg-muted shadow-sm">
              <img [src]="product.image" [alt]="product.title" class="object-cover w-full h-full" />
              <div class="absolute top-4 right-4 rounded-full bg-background/90 backdrop-blur p-2 shadow-md md:hidden">
                @if (product.isVeg) {
                  <lucide-icon [img]="Leaf" class="h-6 w-6 text-green-600 fill-green-600"></lucide-icon>
                } @else {
                  <lucide-icon [img]="Utensils" class="h-6 w-6 text-red-600"></lucide-icon>
                }
              </div>
            </div>

            <!-- Content Section -->
            <div class="flex flex-col space-y-6 sm:py-4">
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span hlmBadge [variant]="product.isVeg ? 'secondary' : 'destructive'" class="uppercase text-[10px] tracking-wider px-3 py-1">
                        {{ product.isVeg ? 'Vegetarian' : 'Non-Veg' }}
                    </span>
                    @if(product.isSpecial) {
                       <span hlmBadge class="bg-amber-100 text-amber-700 border-amber-200 uppercase text-[10px] tracking-wider px-3 py-1 flex items-center gap-1">
                          <lucide-icon [img]="Zap" class="h-3 w-3 fill-current"></lucide-icon>
                          Today's Special
                       </span>
                    }
                  </div>
                  @if(product.origin && product.origin !== 'Standard') {
                     <div class="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-muted/50 px-3 py-1 rounded-full border border-border/30">
                        @if(product.origin === 'Farm') {
                           <lucide-icon [img]="Sprout" class="h-3 w-3 text-green-600"></lucide-icon>
                           Sourced from local farm
                        } @else {
                           <lucide-icon [img]="HomeIcon" class="h-3 w-3 text-purple-600"></lucide-icon>
                           Handmade with love
                        }
                     </div>
                  }
                  <span class="text-2xl font-bold text-primary">{{ product.price | currency:'INR':'symbol':'1.2-2' }}</span>
                </div>
                
                <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">{{ product.title }}</h1>
                <p class="text-muted-foreground leading-relaxed text-lg sm:text-xl">
                  {{ product.description }}
                </p>
              </div>

              <div class="space-y-4 pt-6 border-t pb-20 sm:pb-0">
                <h3 class="font-bold text-xl flex items-center gap-2">
                  <div class="h-6 w-1 bg-primary rounded-full"></div>
                  Ingredients
                </h3>
                <ul class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  @for (ing of product.ingredients; track ing) {
                    <li class="flex items-center gap-3 text-base text-muted-foreground bg-muted/30 p-3 rounded-xl border border-transparent hover:border-border transition-colors">
                      <div class="h-6 w-6 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                        <lucide-icon [img]="Check" class="h-4 w-4 text-green-600"></lucide-icon>
                      </div>
                      {{ ing }}
                    </li>
                  }
                </ul>
              </div>

              <!-- Desktop Button -->
              <div class="hidden sm:block pt-6">
                <button hlmBtn size="lg" class="w-full h-14 text-lg rounded-xl shadow-lg hover:shadow-primary/20 transition-all font-bold" (click)="addToCart(product)">
                  Add to Cart - {{ product.price | currency:'INR':'symbol':'1.2-2' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Mobile Sticky CTA -->
          <div class="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-xl border-t z-50 sm:hidden">
             <button hlmBtn size="lg" class="w-full h-14 text-lg rounded-2xl shadow-xl font-extrabold flex items-center justify-between px-6" (click)="addToCart(product)">
                <span>Add to Cart</span>
                <span class="bg-primary-foreground/20 px-3 py-1 rounded-lg">{{ product.price | currency:'INR':'symbol':'1.2-2' }}</span>
             </button>
          </div>
        } @else {
          <div class="flex flex-col items-center justify-center py-20 text-muted-foreground text-center">
             <h2 class="text-2xl font-bold">Product not found</h2>
             <a routerLink="/" hlmBtn variant="link" class="mt-4">Back to home</a>
          </div>
        }
      </div>
    </div>
  `
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  productStore = inject(ProductStore);
  private cartStore = inject(CartStore);

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      this.productStore.selectProduct(id);
    });
  }

  addToCart(product: Product) {
    this.cartStore.addToCart(product);
  }

  readonly Star = Star;
  readonly Check = Check;
  readonly ArrowLeft = ArrowLeft;
  readonly Leaf = Leaf;
  readonly Utensils = Utensils;
  readonly Zap = Zap;
  readonly Sprout = Sprout;
  readonly HomeIcon = Home;
}
