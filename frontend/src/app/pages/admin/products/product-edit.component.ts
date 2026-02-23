import { Component, inject, OnInit, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductStore } from '../../../store/product.store';
import { Product } from '../../../services/mock-data.service';
import { HlmButtonDirective } from '../../../ui/ui-button/ui-button.directive';
import { HlmInputDirective } from '../../../ui/ui-input/ui-input.directive';
import { HlmCardDirective, HlmCardHeaderDirective, HlmCardTitleDirective, HlmCardContentDirective } from '../../../ui/ui-card/ui-card.directive';
import { LucideAngularModule, ArrowLeft, Save, X, Utensils, Leaf, Star, Tag, Info, Image as ImageIcon, Zap, Sprout, Home, Upload } from 'lucide-angular';
import { CanComponentDeactivate } from '../../../guards/can-deactivate.guard';
import { ConfirmationDialogComponent } from '../../../components/confirmation-dialog/confirmation-dialog.component';
import { Observable, Subject, fromEvent, takeUntil } from 'rxjs';
import { HostListener } from '@angular/core';

@Component({
   selector: 'app-admin-product-edit',
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
      LucideAngularModule,
      ConfirmationDialogComponent
   ],
   template: `
    <div class="min-h-screen bg-muted/20 text-foreground pb-12">
      <div class="container py-4 sm:py-6 px-4 max-w-5xl">
        <!-- Header -->
        <div class="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div class="space-y-0.5">
              <button (click)="goBack()" class="flex items-center gap-1.5 text-[9px] font-black text-muted-foreground hover:text-primary transition-colors uppercase tracking-[0.2em] mb-1">
                <lucide-icon [img]="ArrowLeft" class="h-2.5 w-2.5"></lucide-icon>
                Back to Catalog
              </button>
              <h1 class="text-2xl font-black tracking-tight flex items-center gap-2">
                {{ isEditMode() ? 'Edit Product' : 'New Dish' }}
                @if(isDirty()) {
                  <span class="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" title="Unsaved changes"></span>
                }
              </h1>
            </div>
            
             <div class="flex items-center gap-2">
                <button (click)="goBack()" hlmBtn variant="ghost" class="rounded-lg font-bold px-4 h-9 text-xs border-none hover:bg-muted/50" [disabled]="productStore.loading()">
                   Cancel
                </button>
                <button 
                   (click)="save()" 
                   hlmBtn 
                   class="rounded-lg h-10 px-6 font-black text-xs shadow-md shadow-primary/10 flex items-center gap-2 transition-all active:scale-95" 
                   [disabled]="!isValid() || !isDirty() || productStore.loading()"
                 >
                   @if (productStore.loading()) {
                      <div class="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Saving...
                   } @else {
                      <lucide-icon [img]="Save" class="h-3.5 w-3.5"></lucide-icon>
                      Save Changes
                   }
                </button>
             </div>
         </div>

         @if (productStore.error()) {
            <div class="mb-5 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-[10px] font-black uppercase tracking-widest flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
               <lucide-icon [img]="X" class="h-3.5 w-3.5"></lucide-icon>
               {{ productStore.error() }}
            </div>
         }

        <!-- Compact Form Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
           <!-- Main Content Area -->
           <div class="lg:col-span-8 space-y-5">
             <div hlmCard class="border-none shadow-sm rounded-2xl bg-background overflow-hidden">
                <div hlmCardHeader class="py-3 px-6 border-b border-border/40 bg-muted/5">
                   <div hlmCardTitle class="text-[10px] font-black flex items-center gap-2 uppercase tracking-widest text-muted-foreground">
                      <div class="p-1 bg-primary/10 rounded-md">
                        <lucide-icon [img]="Info" class="h-3 w-3 text-primary"></lucide-icon>
                      </div>
                      Product Narrative
                   </div>
                </div>
                <div hlmCardContent class="p-6 space-y-4">
                   <div class="grid grid-cols-1 gap-4">
                      <div class="space-y-1.5">
                        <label class="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-0.5">Title</label>
                        <input hlmInput [ngModel]="localData().title" (ngModelChange)="updateField('title', $event)" placeholder="Delicious Dish Name" class="w-full h-10 bg-muted/30 border-none rounded-lg px-4 font-bold focus:ring-1 ring-primary/20 text-base" />
                      </div>
                      <div class="space-y-1.5">
                        <label class="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-0.5">Description</label>
                        <textarea hlmInput [ngModel]="localData().description" (ngModelChange)="updateField('description', $event)" placeholder="Short appetizing summary..." class="w-full min-h-[80px] bg-muted/30 border-none rounded-xl p-4 font-medium focus:ring-1 ring-primary/20 resize-none text-sm"></textarea>
                      </div>
                   </div>
                </div>
             </div>

             <div hlmCard class="border-none shadow-sm rounded-2xl bg-background overflow-hidden">
                <div hlmCardHeader class="py-3 px-6 border-b border-border/40 bg-muted/5">
                   <div hlmCardTitle class="text-[10px] font-black flex items-center gap-2 uppercase tracking-widest text-muted-foreground">
                      <div class="p-1 bg-primary/10 rounded-md">
                        <lucide-icon [img]="Tag" class="h-3 w-3 text-primary"></lucide-icon>
                      </div>
                      Configuration
                   </div>
                </div>
                <div hlmCardContent class="p-6 space-y-5">
                   <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div class="space-y-1.5">
                        <label class="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-0.5">Price (₹)</label>
                        <div class="relative">
                           <span class="absolute left-3.5 top-1/2 -translate-y-1/2 font-black text-xs text-muted-foreground">₹</span>
                           <input hlmInput type="number" [ngModel]="localData().price" (ngModelChange)="updateField('price', $event)" placeholder="0.00" class="pl-7 w-full h-10 bg-muted/30 border-none rounded-lg px-4 font-black focus:ring-1 ring-primary/20 text-sm" />
                        </div>
                      </div>
                      <div class="space-y-1.5">
                        <label class="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-0.5">Category</label>
                        <input hlmInput [ngModel]="localData().category" (ngModelChange)="updateField('category', $event)" placeholder="Burgers, Pizza, etc." class="w-full h-10 bg-muted/30 border-none rounded-lg px-4 font-bold focus:ring-1 ring-primary/20 text-sm" />
                      </div>
                   </div>

                   <!-- Dietary Classification -->
                   <div class="space-y-2">
                       <label class="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-0.5">Dietary Classification</label>
                       <div class="flex p-0.5 bg-muted/40 rounded-xl gap-0.5">
                          <button 
                             (click)="updateField('isVeg', true)" 
                             [class]="localData().isVeg ? 'bg-background text-green-600 shadow-sm ring-1 ring-border/10' : 'text-muted-foreground hover:bg-muted/60'" 
                             class="flex-1 px-3 py-2.5 rounded-lg font-black text-[9px] uppercase flex items-center justify-center gap-2 transition-all"
                          >
                             <div class="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.4)]"></div>
                             Veg
                          </button>
                          <button 
                             (click)="updateField('isVeg', false)" 
                             [class]="!localData().isVeg ? 'bg-background text-red-600 shadow-sm ring-1 ring-border/10' : 'text-muted-foreground hover:bg-muted/60'" 
                             class="flex-1 px-3 py-2.5 rounded-lg font-black text-[9px] uppercase flex items-center justify-center gap-2 transition-all"
                          >
                             <div class="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.4)]"></div>
                             Non-Veg
                          </button>
                       </div>
                   </div>

                   <!-- Advanced Configuration Row -->
                   <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <!-- Special Toggle -->
                      <div class="space-y-2">
                         <label class="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-0.5">Promotional Status</label>
                         <button 
                            (click)="updateField('isSpecial', !localData().isSpecial)" 
                            [class]="localData().isSpecial ? 'bg-amber-100/50 text-amber-700 ring-1 ring-amber-200' : 'bg-muted/40 text-muted-foreground'" 
                            class="w-full h-10 px-4 rounded-xl font-bold text-xs flex items-center gap-2 transition-all"
                         >
                            <lucide-icon [img]="Zap" class="h-3.5 w-3.5" [class.fill-current]="localData().isSpecial"></lucide-icon>
                            Today's Special
                            @if(localData().isSpecial) {
                               <span class="ml-auto text-[8px] bg-amber-200 px-1.5 py-0.5 rounded-md">BOOSTED</span>
                            }
                         </button>
                      </div>

                      <!-- Origin Selector -->
                      <div class="space-y-2">
                         <label class="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-0.5">Product Origin</label>
                         <div class="flex p-0.5 bg-muted/40 rounded-xl gap-0.5">
                            <button (click)="updateField('origin', 'Standard')" [class]="localData().origin === 'Standard' || !localData().origin ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted/60'" class="flex-1 px-2 py-2 rounded-lg font-black text-[9px] uppercase transition-all">
                               Std
                            </button>
                            <button (click)="updateField('origin', 'Farm')" [class]="localData().origin === 'Farm' ? 'bg-background text-green-600 shadow-sm' : 'text-muted-foreground hover:bg-muted/60'" class="flex-1 px-2 py-2 rounded-lg font-black text-[9px] uppercase flex items-center justify-center gap-1 transition-all">
                               <lucide-icon [img]="Sprout" class="h-2.5 w-2.5"></lucide-icon>
                               Farm
                            </button>
                            <button (click)="updateField('origin', 'Homemade')" [class]="localData().origin === 'Homemade' ? 'bg-background text-purple-600 shadow-sm' : 'text-muted-foreground hover:bg-muted/60'" class="flex-1 px-2 py-2 rounded-lg font-black text-[9px] uppercase flex items-center justify-center gap-1 transition-all">
                               <lucide-icon [img]="HomeIcon" class="h-2.5 w-2.5"></lucide-icon>
                               Home
                            </button>
                         </div>
                      </div>
                   </div>

                   <div class="space-y-2">
                      <label class="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-0.5">Ingredients</label>
                      <input hlmInput [(ngModel)]="ingredientsText" (ngModelChange)="onIngredientsChange($event)" placeholder="Tomato, Cheese, Bun..." class="w-full h-10 bg-muted/30 border-none rounded-lg px-4 font-medium text-sm" />
                      <div class="flex flex-wrap gap-1 mt-1.5">
                         @for(ing of localData().ingredients; track ing) {
                            @if(ing) {
                               <span class="bg-primary/5 text-primary text-[8px] font-black uppercase tracking-tighter border-none rounded-full px-2.5 py-0.5">
                                  # {{ ing }}
                               </span>
                            }
                         }
                      </div>
                   </div>

                   <!-- Tags Implementation (Internal storage as string for now) -->
                   <div class="space-y-2">
                      <label class="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-0.5">Display Tags</label>
                      <input hlmInput [(ngModel)]="tagsText" (ngModelChange)="onTagsChange($event)" placeholder="Bestseller, Spicy, New..." class="w-full h-10 bg-muted/30 border-none rounded-lg px-4 font-medium text-sm" />
                      <div class="flex flex-wrap gap-1 mt-1.5">
                         @for(tag of localData().tags; track tag) {
                            @if(tag) {
                               <span class="bg-amber-500/10 text-amber-700 text-[8px] font-black uppercase tracking-tighter border-none rounded-full px-2.5 py-0.5">
                                  {{ tag }}
                               </span>
                            }
                         }
                      </div>
                   </div>
                </div>
             </div>
           </div>

           <!-- Sidebar / Preview -->
           <div class="lg:col-span-4 space-y-5">
             <div hlmCard class="border-none shadow-sm rounded-2xl bg-background overflow-hidden sticky top-24">
                       <div class="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-muted group/img shadow-inner ring-1 ring-border/5">
                          <img [src]="localData().image || stockImage" class="object-cover w-full h-full transition-transform duration-700 group-hover/img:scale-110" />
                   <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
                   <div class="absolute bottom-4 left-5 right-5">
                      <span class="text-[8px] font-black text-white/50 uppercase tracking-[0.2em] mb-0.5 block">Live Preview</span>
                      <h2 class="text-base font-black text-white truncate">{{ localData().title || 'Untitled' }}</h2>
                      <p class="text-primary font-black text-sm">{{ (localData().price || 0) | currency:'INR':'symbol':'1.2-2' }}</p>
                   </div>
                </div>
                <div hlmCardContent class="p-5 space-y-4">
                   <div class="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-3">
                      <span>Status</span>
                      <span class="text-green-500 flex items-center gap-1">
                         <span class="h-1 w-1 rounded-full bg-green-500"></span>
                         Active
                      </span>
                   </div>

                    <!-- File Upload Area -->
                    <div class="space-y-3 pt-1">
                       <label class="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-0.5">Gallery Asset</label>
                       
                       <div 
                          class="relative aspect-[4/3] w-full rounded-xl overflow-hidden border-2 bg-muted/30 group transition-all"
                          [class.border-primary]="selectedFile()"
                          [class.border-dashed]="!selectedFile()"
                       >
                          @if (localData().image && localData().image !== stockImage) {
                             <img [src]="localData().image" class="object-cover w-full h-full" />
                          } @else {
                             <div class="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground/40 group-hover:text-primary/60 transition-colors">
                                <lucide-icon [img]="Upload" class="h-6 w-6"></lucide-icon>
                                <span class="text-[8px] font-black uppercase">No Image Selected</span>
                             </div>
                          }
                       </div>

                       <div 
                          class="relative group cursor-pointer overflow-hidden rounded-xl border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 transition-all duration-300 bg-muted/5 flex flex-col items-center justify-center p-5 text-center"
                          (click)="fileInput.click()"
                          [class.border-primary/40]="selectedFile()"
                          [class.bg-primary/5]="selectedFile()"
                       >
                          <input #fileInput type="file" class="hidden" accept="image/*" (change)="onFileSelected($event)" />
                          <lucide-icon [img]="Upload" class="h-5 w-5 text-muted-foreground group-hover:text-primary mb-2 transition-colors" [class.text-primary]="selectedFile()"></lucide-icon>
                          <div class="flex flex-col">
                             <span class="text-[9px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors" [class.text-foreground]="selectedFile()">
                                {{ selectedFile() ? selectedFile()?.name : 'Select Photo' }}
                             </span>
                             <span class="text-[7px] font-bold text-muted-foreground/50 uppercase mt-0.5">Max 2MB • JPG, PNG</span>
                          </div>
                          
                          @if (fileError()) {
                             <span class="absolute inset-x-0 -bottom-1 text-[8px] font-bold text-destructive animate-in fade-in slide-in-from-top-1">{{ fileError() }}</span>
                          }
                       </div>
                    </div>

                      @if (selectedFile()) {
                         <button (click)="clearFile()" class="w-full text-[8px] font-black uppercase tracking-widest text-destructive/60 hover:text-destructive transition-colors text-right px-1">
                            Remove Selection
                         </button>
                      }
                   
                   <div class="space-y-2 pt-1">
                      <div class="flex items-center gap-2.5 p-3 bg-muted/20 rounded-xl">
                         <div class="p-1.5 bg-background rounded-lg text-muted-foreground">
                            <lucide-icon [img]="ImageIcon" class="h-3.5 w-3.5"></lucide-icon>
                         </div>
                         <div class="flex flex-col">
                            <span class="text-[9px] font-black text-foreground uppercase tracking-tight">Stock Managed</span>
                            <span class="text-[8px] font-medium text-muted-foreground opacity-70">Automatic assignment</span>
                         </div>
                      </div>
                   </div>

                   <p class="text-[9px] text-center text-muted-foreground font-bold mt-2 px-1 leading-relaxed opacity-60">
                      Instantly updates the public menu.
                   </p>
                </div>
             </div>
           </div>
        </div>
      </div>
    </div>

    @if(showDiscardDialog()) {
      <app-confirmation-dialog
        title="Discard Changes?"
        message="You have unsaved edits. If you leave now, all progress will be permanently lost."
        confirmLabel="Discard & Leave"
        cancelLabel="Continue Editing"
        variant="destructive"
        (confirm)="resolveDeactivate(true)"
        (cancel)="resolveDeactivate(false)"
      ></app-confirmation-dialog>
    }
  `
})
export class AdminProductEditComponent implements OnInit, CanComponentDeactivate {
   private route = inject(ActivatedRoute);
   private router = inject(Router);
   productStore = inject(ProductStore);

   isEditMode = signal(false);
   initialState: string = '';
   localData = signal<Partial<Product>>({
      title: '',
      price: 0,
      description: '',
      isVeg: true,
      ingredients: [],
      category: '',
      isSpecial: false,
      origin: 'Standard',
      tags: []
   });
   ingredientsText = '';
   tagsText = '';
   stockImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c';

   // File Upload State
   selectedFile = signal<File | null>(null);
   fileError = signal<string | null>(null);

   // Dirty Check & Navigation Guard
   showDiscardDialog = signal(false);
   private deactivateSubject = new Subject<boolean>();
   private isSaving = false;

   isDirty = computed(() => {
      return JSON.stringify(this.localData()) !== this.initialState;
   });

   @HostListener('window:beforeunload', ['$event'])
   unloadNotification($event: any) {
      if (this.isDirty()) {
         $event.returnValue = true;
      }
   }

   ngOnInit() {
      const id = this.route.snapshot.params['id'];
      if (id) {
         this.isEditMode.set(true);
         this.productStore.selectProduct(Number(id));
         const existing = this.productStore.selectedProduct();
         if (existing) {
            this.localData.set({ ...existing });
            this.ingredientsText = (existing.ingredients || []).join(', ');
            this.tagsText = (existing.tags || []).join(', ');
         } else {
            this.router.navigate(['/admin/products']);
         }
      }
      this.initialState = JSON.stringify(this.localData());
   }

   updateField(field: keyof Product | string, value: any) {
      this.localData.update(data => ({ ...data, [field]: value }));
   }

   onIngredientsChange(text: string) {
      const ingredients = text.split(',').map(s => s.trim()).filter(s => !!s);
      this.updateField('ingredients', ingredients);
   }

   onTagsChange(text: string) {
      const tags = text.split(',').map(s => s.trim()).filter(s => !!s);
      this.updateField('tags', tags);
   }

   isValid() {
      const data = this.localData();
      return data.title && data.price && data.price > 0 && data.description;
   }

   save() {
      if (!this.isValid()) return;

      this.isSaving = true;
      const data = this.localData();
      const product: any = {
         ...data,
         ingredients: data.ingredients || [],
         tags: data.tags || [],
         origin: data.origin || 'Standard',
         isSpecial: data.isSpecial || false,
         image: data.image || this.stockImage
      };

      if (this.isEditMode()) {
         this.productStore.updateProduct({ product: product });
      } else {
         this.productStore.addProduct({ product: product });
      }

      // We'll navigate via effect on success
   }

   // Register navigation effect in constructor/init
   private navigationEffect = effect(() => {
      const loading = this.productStore.loading();
      const error = this.productStore.error();

      // If we were saving and now we're not, and there's no error
      if (this.isSaving && !loading) {
         if (!error) {
            // Reset initial state to prevent prompt on navigation
            this.initialState = JSON.stringify(this.localData());
            this.router.navigate(['/admin/products']);
         } else {
            this.isSaving = false; // Stay on page and allow retry
         }
      }
   }, { allowSignalWrites: true });

   onFileSelected(event: any) {
      const file = event.target.files[0];
      if (!file) return;

      if (file.size > 2 * 1024 * 1024) {
         this.fileError.set('File too large (Max 2MB)');
         event.target.value = ''; // Reset input
         return;
      }

      this.fileError.set(null);
      this.selectedFile.set(file);

      const reader = new FileReader();
      reader.onload = () => {
         const base64 = reader.result as string;
         this.updateField('image', base64);
      };
      reader.onerror = () => {
         this.fileError.set('Failed to read file');
      };
      reader.readAsDataURL(file);
   }

   clearFile() {
      this.selectedFile.set(null);
      this.updateField('image', this.stockImage);
      this.fileError.set(null);
   }

   goBack() {
      this.router.navigate(['/admin/products']);
   }

   // CanDeactivate Implementation
   canDeactivate(): Observable<boolean> | boolean {
      if (this.isSaving || !this.isDirty()) {
         return true;
      }
      this.showDiscardDialog.set(true);
      return this.deactivateSubject.asObservable();
   }

   resolveDeactivate(confirm: boolean) {
      this.showDiscardDialog.set(false);
      this.deactivateSubject.next(confirm);
   }

   readonly ArrowLeft = ArrowLeft;
   readonly Save = Save;
   readonly X = X;
   readonly Leaf = Leaf;
   readonly Utensils = Utensils;
   readonly Star = Star;
   readonly Tag = Tag;
   readonly Info = Info;
   readonly ImageIcon = ImageIcon;
   readonly Zap = Zap;
   readonly Sprout = Sprout;
   readonly HomeIcon = Home;
   readonly Upload = Upload;
}
