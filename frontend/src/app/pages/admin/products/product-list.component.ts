import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductStore } from '../../../store/product.store';
import { HlmButtonDirective } from '../../../ui/ui-button/ui-button.directive';
import { HlmBadgeDirective } from '../../../ui/ui-badge/ui-badge.directive';
import { HlmInputDirective } from '../../../ui/ui-input/ui-input.directive';
import { LucideAngularModule, Plus, Pencil, Trash2, ArrowLeft, Search, Filter, Zap, Sprout, Home } from 'lucide-angular';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ConfirmationDialogComponent } from '../../../components/confirmation-dialog/confirmation-dialog.component';

@Component({
   selector: 'app-admin-product-list',
   standalone: true,
   imports: [
      CommonModule,
      HlmInputDirective,
      LucideAngularModule,
      RouterLink,
      FormsModule,
      ConfirmationDialogComponent
   ],
   template: `
    <div class="min-h-screen bg-muted/20 text-foreground pb-12">
      <div class="container py-4 sm:py-6 px-4 sm:px-8 max-w-6xl">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
          <div class="space-y-0.5">
            <a routerLink="/admin" class="flex items-center gap-1.5 text-[9px] font-black text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest mb-1">
              <lucide-icon [img]="ArrowLeft" class="h-2.5 w-2.5"></lucide-icon>
              Admin Dashboard
            </a>
            <h1 class="text-2xl font-black tracking-tight flex items-center gap-2">
              Catalog Management
              <span class="bg-primary/10 text-primary text-[8px] rounded-md px-2 py-0.5 font-black uppercase tracking-tighter">
                {{ productStore.products().length }} ITEMS
              </span>
            </h1>
          </div>
          <a hlmBtn routerLink="/admin/products/new" class="rounded-xl h-10 px-5 font-black text-xs shadow-md shadow-primary/10 flex items-center gap-2 transition-all active:scale-95">
            <lucide-icon [img]="Plus" class="h-4 w-4"></lucide-icon>
            Add Dish
          </a>
        </div>

        <!-- Search & Filter Bar -->
        <div class="bg-background rounded-2xl p-3 shadow-sm mb-5 border-none flex flex-col sm:flex-row gap-3">
            <div class="relative flex-1">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <lucide-icon [img]="Search" class="h-4 w-4 text-muted-foreground/50"></lucide-icon>
              </div>
              <input 
                hlmInput 
                [(ngModel)]="searchQuery"
                placeholder="Search catalog..." 
                class="pl-11 w-full h-10 bg-muted/30 border-none rounded-xl focus:ring-1 ring-primary/20 placeholder:text-muted-foreground/40 font-medium text-sm"
              />
            </div>
           <button hlmBtn variant="outline" class="h-10 rounded-xl px-4 font-bold text-xs flex items-center gap-2 transition-colors hover:bg-muted/50 border-muted">
              <lucide-icon [img]="Filter" class="h-3.5 w-3.5"></lucide-icon>
              Filters
           </button>
        </div>

        <!-- Product Table/List -->
        <div class="bg-background rounded-2xl shadow-sm overflow-hidden border-none">
           <div class="overflow-x-auto">
             <table class="w-full text-left border-collapse">
               <thead>
                 <tr class="bg-muted/30">
                   <th class="px-5 py-3 text-[9px] font-black uppercase tracking-widest text-muted-foreground/70">Product</th>
                   <th class="px-5 py-3 text-[9px] font-black uppercase tracking-widest text-muted-foreground/70 hidden sm:table-cell text-center">Category</th>
                   <th class="px-5 py-3 text-[9px] font-black uppercase tracking-widest text-muted-foreground/70 text-center">Price</th>
                   <th class="px-5 py-3 text-[9px] font-black uppercase tracking-widest text-muted-foreground/70 text-center">Diet</th>
                   <th class="px-5 py-3 text-[9px] font-black uppercase tracking-widest text-muted-foreground/70 text-right">Actions</th>
                 </tr>
               </thead>
               <tbody class="divide-y divide-border/50">
                 @for(product of filteredProducts(); track product.id) {
                    <tr class="hover:bg-muted/10 transition-colors group">
                      <td class="px-5 py-2.5">
                        <div class="flex items-center gap-3">
                           <div class="h-9 w-9 rounded-lg bg-muted overflow-hidden flex-shrink-0 border border-border/20 shadow-sm">
                              <img [src]="product.image" class="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                           </div>
                           <div class="flex flex-col">
                              <span class="font-black text-sm text-foreground leading-none mb-0.5">{{ product.title }}</span>
                              <span class="text-[8px] text-muted-foreground font-black uppercase tracking-tight opacity-50">#{{ product.id }}</span>
                           </div>
                        </div>
                      </td>
                      <td class="px-5 py-2.5 hidden sm:table-cell text-center">
                         <span class="text-[8px] font-black text-muted-foreground uppercase tracking-widest bg-muted/60 px-2 py-0.5 rounded-md">{{ product.category || 'General' }}</span>
                      </td>
                      <td class="px-5 py-2.5 text-center">
                         <span class="font-black text-xs text-foreground">{{ product.price | currency }}</span>
                      </td>
                      <td class="px-5 py-2.5 text-center">
                         <div class="flex justify-center">
                            @if(product.isVeg) {
                               <div class="h-2 w-2 rounded-full bg-green-500/80 shadow-[0_0_6px_rgba(34,197,94,0.3)]" title="Veg"></div>
                            } @else {
                               <div class="h-2 w-2 rounded-full bg-red-500/80 shadow-[0_0_6px_rgba(239,68,68,0.3)]" title="Non-Veg"></div>
                            }
                         </div>
                      </td>
                      <td class="px-5 py-2.5 text-right">
                         <div class="flex items-center justify-end gap-1">
                            <a [routerLink]="['/admin/products/edit', product.id]" hlmBtn variant="ghost" size="icon" class="h-8 w-8 flex items-center justify-center p-0 rounded-lg hover:bg-primary/10 hover:text-primary transition-all">
                               <lucide-icon [img]="Pencil" class="h-3.5 w-3.5"></lucide-icon>
                            </a>
                            <button (click)="confirmDelete(product)" hlmBtn variant="ghost" size="icon" class="h-8 w-8 flex items-center justify-center p-0 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-all">
                               <lucide-icon [img]="Trash2" class="h-3.5 w-3.5"></lucide-icon>
                            </button>
                         </div>
                      </td>
                    </tr>
                 } @empty {
                   <tr>
                     <td colspan="5" class="px-5 py-16 text-center">
                        <div class="flex flex-col items-center gap-1.5 opacity-30">
                           <lucide-icon [img]="Search" class="h-6 w-6"></lucide-icon>
                           <p class="font-black uppercase tracking-widest text-[10px]">Empty Catalog</p>
                        </div>
                     </td>
                   </tr>
                 }
               </tbody>
             </table>
           </div>
        </div>
      </div>
    </div>

    <!-- Generic Delete Confirmation Dialog -->
    @if(productToDelete()) {
      <app-confirmation-dialog
        title="Delete Product?"
        [message]="getDeleteMessage()"
        confirmLabel="Confirm Delete"
        cancelLabel="Discard"
        variant="destructive"
        (confirm)="deleteSelected()"
        (cancel)="productToDelete.set(null)"
      ></app-confirmation-dialog>
    }
  `
})
export class AdminProductListComponent {
   productStore = inject(ProductStore);
   searchQuery = signal('');
   productToDelete = signal<any>(null);

   filteredProducts = computed(() => {
      const products = this.productStore.products();
      const query = this.searchQuery().toLowerCase();

      if (!query) return products;

      return products.filter(p =>
         p.title.toLowerCase().includes(query) ||
         (p.category && p.category.toLowerCase().includes(query)) ||
         p.id.toString().includes(query)
      );
   });

   getDeleteMessage() {
      const prod = this.productToDelete();
      return `Are you sure you want to remove "${prod?.title}"? This action cannot be undone.`;
   }

   confirmDelete(product: any) {
      this.productToDelete.set(product);
   }

   deleteSelected() {
      const prod = this.productToDelete();
      if (prod) {
         this.productStore.deleteProduct(prod.id);
         this.productToDelete.set(null);
      }
   }

   readonly Plus = Plus;
   readonly Pencil = Pencil;
   readonly Trash2 = Trash2;
   readonly ArrowLeft = ArrowLeft;
   readonly Search = Search;
   readonly Filter = Filter;
   readonly Zap = Zap;
   readonly Sprout = Sprout;
   readonly HomeIcon = Home;
}
