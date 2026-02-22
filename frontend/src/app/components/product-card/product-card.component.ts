import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../services/mock-data.service';
import { HlmButtonDirective } from '../../ui/ui-button/ui-button.directive';
import {
  HlmCardDirective,
  HlmCardHeaderDirective,
  HlmCardTitleDirective,
  HlmCardDescriptionDirective,
  HlmCardContentDirective,
  HlmCardFooterDirective
} from '../../ui/ui-card/ui-card.directive';
import { LucideAngularModule, Star, Plus, Leaf, Utensils, Zap, Sprout, Home } from 'lucide-angular';
import { RouterLink } from '@angular/router';
import { HlmBadgeDirective } from '../../ui/ui-badge/ui-badge.directive';
import { slideUpAnimation } from '../../animations';

@Component({
  selector: 'app-product-card',
  standalone: true,
  animations: [slideUpAnimation],
  host: {
    '[@slideUpAnimation]': ''
  },
  imports: [
    CommonModule,
    RouterLink,
    HlmCardDirective,
    HlmCardHeaderDirective,
    HlmCardTitleDirective,
    HlmCardDescriptionDirective,
    HlmCardContentDirective,
    HlmCardFooterDirective,
    HlmButtonDirective,
    HlmBadgeDirective,
    LucideAngularModule
  ],
  template: `
    <div hlmCard class="h-full overflow-hidden transition-all hover:shadow-xl hover:shadow-primary/5 group flex flex-col active:scale-[0.98] duration-300">
      <a [routerLink]="['/product', product.id]" class="block relative aspect-[4/3] overflow-hidden bg-muted">
        <img [src]="product.image" [alt]="product.title" class="object-cover w-full h-full transition-transform group-hover:scale-105 duration-300" loading="lazy" />
        
        <!-- Status Badges -->
        <div class="absolute top-2 left-2 flex flex-col gap-1.5">
          @if (product.isSpecial) {
             <span hlmBadge class="bg-amber-100/90 text-amber-800 border-amber-200 backdrop-blur-sm text-[10px] py-0 px-2 h-5 flex items-center gap-1 shadow-sm">
               <lucide-icon [img]="Zap" class="h-2.5 w-2.5 fill-current"></lucide-icon>
               TODAY'S SPECIAL
             </span>
          }
          @if (product.origin === 'Farm') {
            <span hlmBadge variant="secondary" class="bg-green-100/90 text-green-800 border-green-200 backdrop-blur-sm text-[10px] py-0 px-2 h-5 flex items-center gap-1 shadow-sm">
              <lucide-icon [img]="Sprout" class="h-2.5 w-2.5"></lucide-icon>
              FARM PRODUCT
            </span>
          }
          @if (product.origin === 'Homemade') {
            <span hlmBadge variant="secondary" class="bg-purple-100/90 text-purple-800 border-purple-200 backdrop-blur-sm text-[10px] py-0 px-2 h-5 flex items-center gap-1 shadow-sm">
              <lucide-icon [img]="Home" class="h-2.5 w-2.5"></lucide-icon>
              HOMEMADE
            </span>
          }
        </div>

        <div class="absolute top-2 right-2 rounded-full bg-background/90 backdrop-blur p-1.5 shadow-sm">
          @if (product.isVeg) {
            <lucide-icon [img]="Leaf" class="h-4 w-4 text-green-600 fill-green-600"></lucide-icon>
          } @else {
            <lucide-icon [img]="Utensils" class="h-4 w-4 text-red-600"></lucide-icon>
          }
        </div>
      </a>
      
      <div hlmCardHeader class="p-3 sm:p-4 space-y-1.5">
        <div class="flex justify-between items-start gap-2">
            <a [routerLink]="['/product', product.id]" class="block flex-1">
                <h3 hlmCardTitle class="text-base sm:text-lg leading-tight line-clamp-1 group-hover:text-primary transition-colors">{{ product.title }}</h3>
            </a>
        </div>
        <p hlmCardDescription class="line-clamp-2 text-[10px] sm:text-xs min-h-[2.5em]">{{ product.description }}</p>
      </div>

      <div hlmCardContent class="px-3 sm:px-4 pb-2 pt-0 flex-1">
          <div class="flex flex-wrap gap-1">
             @for(ing of product.ingredients.slice(0, 2); track ing) {
                 <span class="text-[9px] sm:text-[10px] bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">{{ing}}</span>
             }
             @if(product.ingredients.length > 2) {
                 <span class="text-[9px] sm:text-[10px] text-muted-foreground font-medium">+{{product.ingredients.length - 2}}</span>
             }
          </div>
      </div>

      <div hlmCardFooter class="p-3 sm:p-4 pt-2 sm:pt-3 mt-auto flex items-center justify-between border-t border-border/50 bg-muted/10">
        <span class="text-base sm:text-lg font-bold text-foreground">
            {{ product.price | currency }}
        </span>
        <button 
          hlmBtn variant="default" size="sm" 
          (click)="addToCart.emit(product)" 
          class="h-9 px-4 gap-1 shadow-sm rounded-full sm:rounded-md active:scale-90 transition-transform"
        >
            <span class="hidden sm:inline">Add</span>
            <lucide-icon [img]="Plus" class="h-4 w-4"></lucide-icon>
        </button>
      </div>
    </div>
  `
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  @Output() addToCart = new EventEmitter<Product>();

  readonly Star = Star;
  readonly Plus = Plus;
  readonly Leaf = Leaf;
  readonly Utensils = Utensils;
  readonly Zap = Zap;
  readonly Sprout = Sprout;
  readonly Home = Home;
}
