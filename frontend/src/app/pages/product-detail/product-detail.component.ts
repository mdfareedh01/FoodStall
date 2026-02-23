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
      <div class="container py-4 sm:py-8 px-4 sm:px-8 max-w-5xl">
        <a routerLink="/" class="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 hover:text-primary mb-6 transition-all group">
          <lucide-icon [img]="ArrowLeft" class="h-3 w-3 transition-transform group-hover:-translate-x-1"></lucide-icon>
          Back to Menu
        </a>

        @if (productStore.loading()) {
          <div class="flex flex-col items-center justify-center py-20 text-muted-foreground">
             <div class="loader mb-4 border-4 border-primary/30 border-t-primary rounded-full w-8 h-8 animate-spin"></div>
             Loading details...
          </div>
        } @else if (productStore.selectedProduct(); as product) {
          <div class="grid md:grid-cols-2 gap-8 lg:gap-16 items-start">
            <!-- Image Section -->
            <div class="relative aspect-square sm:aspect-[4/3] md:aspect-square md:h-[500px] overflow-hidden rounded-[2.5rem] border-none bg-muted/30 shadow-2xl shadow-primary/5 group">
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
            <div class="flex flex-col space-y-8 sm:py-2">
              <div class="space-y-4">
                <div class="flex flex-wrap items-center justify-between gap-4">
                  <div class="flex items-center gap-2">
                    <span hlmBadge [variant]="product.isVeg ? 'secondary' : 'destructive'" class="uppercase text-[9px] font-black tracking-[0.2em] px-3 py-1 bg-opacity-10 border-none">
                        {{ product.isVeg ? 'Vegetarian' : 'Non-Veg' }}
                    </span>
                    @if(product.isSpecial) {
                       <span hlmBadge class="bg-amber-100/50 text-amber-700 border-none uppercase text-[9px] font-black tracking-[0.2em] px-3 py-1 flex items-center gap-1.5">
                          <lucide-icon [img]="Zap" class="h-3 w-3 fill-current"></lucide-icon>
                          Special
                       </span>
                    }
                  </div>
                  @if(product.origin && product.origin !== 'Standard') {
                     <div class="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 bg-muted/30 px-3 py-1 rounded-full border border-border/10">
                        @if(product.origin === 'Farm') {
                           <lucide-icon [img]="Sprout" class="h-3 w-3 text-green-600"></lucide-icon>
                           Local Farm
                        } @else {
                           <lucide-icon [img]="HomeIcon" class="h-3 w-3 text-purple-600"></lucide-icon>
                           Handmade
                        }
                     </div>
                  }
                </div>
                
                <div class="space-y-2">
                   <div class="flex items-center justify-between">
                      <h1 class="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground lowercase italic">/ {{ product.title }}</h1>
                      <span class="text-2xl font-black text-primary tracking-tighter">{{ product.price | currency:'INR':'symbol':'1.2-2' }}</span>
                   </div>
                   <p class="text-muted-foreground/80 leading-relaxed text-sm sm:text-base font-medium max-w-xl">
                     {{ product.description }}
                   </p>
                </div>
              </div>

              <div class="space-y-6 pt-8 border-t border-dashed border-border/40 pb-20 sm:pb-0">
                <h3 class="font-black text-sm uppercase tracking-[0.3em] flex items-center gap-3 text-foreground/40 italic">
                   Ingredients
                   <div class="h-px flex-1 bg-border/20"></div>
                </h3>
                <ul class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  @for (ing of product.ingredients; track ing) {
                    <li class="flex items-center gap-3 text-xs font-bold text-muted-foreground/70 bg-muted/20 p-3 rounded-2xl border border-transparent hover:border-primary/10 transition-all hover:bg-background shadow-sm hover:shadow-md group">
                      <div class="h-5 w-5 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0 group-hover:bg-green-500 group-hover:text-white transition-colors">
                        <lucide-icon [img]="Check" class="h-3 w-3"></lucide-icon>
                      </div>
                      {{ ing }}
                    </li>
                  }
                </ul>
              </div>

              <!-- Desktop Button -->
              <div class="hidden sm:block pt-4">
                <button hlmBtn size="lg" class="w-full h-14 text-sm uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-primary/10 hover:shadow-primary/20 transition-all font-black" (click)="addToCart(product)">
                  Add to Cart — {{ product.price | currency:'INR':'symbol':'1.2-2' }}
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
