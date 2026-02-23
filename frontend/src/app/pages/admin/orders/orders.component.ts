import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderStore } from '../../../store/order.store';
import { LucideAngularModule, ShoppingBag, Clock, CheckCircle2, XCircle, Search, ChevronRight, Package, User, Phone, MapPin, ExternalLink, Filter, SortAsc, ArrowUpWideNarrow, ArrowDownWideNarrow } from 'lucide-angular';
import { HlmButtonDirective } from '../../../ui/ui-button/ui-button.directive';
import { HlmCardDirective, HlmCardHeaderDirective, HlmCardTitleDirective, HlmCardContentDirective } from '../../../ui/ui-card/ui-card.directive';
import { HlmInputDirective } from '../../../ui/ui-input/ui-input.directive';
import { FormsModule } from '@angular/forms';

@Component({
   selector: 'app-admin-orders',
   standalone: true,
   imports: [
      CommonModule,
      LucideAngularModule,
      HlmButtonDirective,
      HlmCardDirective,
      HlmCardHeaderDirective,
      HlmCardTitleDirective,
      HlmCardContentDirective,
      HlmInputDirective,
      FormsModule
   ],
   template: `
    <div class="min-h-screen bg-muted/20 pb-12">
      <div class="container py-6 px-4 sm:px-8 max-w-7xl">
        <!-- Header Section -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div class="space-y-1">
            <h1 class="text-3xl font-black tracking-tight flex items-center gap-3 text-foreground">
              <lucide-icon [img]="ShoppingBag" class="h-8 w-8 text-primary"></lucide-icon>
              Order Fulfillment
            </h1>
            <p class="text-xs text-muted-foreground font-bold tracking-widest uppercase opacity-70 flex items-center gap-2">
              <span class="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></span>
              Live Order Queue • {{ orderStore.orders().length }} Total
            </p>
          </div>
          
          <div class="flex items-center gap-2">
            <button hlmBtn variant="outline" class="h-10 rounded-xl px-4 font-black text-[10px] uppercase tracking-widest border-muted shadow-sm hover:bg-background transition-all active:scale-95">
              <lucide-icon [img]="Filter" class="h-3.5 w-3.5 mr-2 opacity-50"></lucide-icon>
              Export Report
            </button>
          </div>
        </div>

        <!-- Filter Bar -->
        <div class="bg-background rounded-2xl p-3 shadow-sm mb-6 border-none flex flex-col sm:flex-row gap-3 items-center">
            <div class="relative flex-1 w-full">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <lucide-icon [img]="Search" class="h-4 w-4 text-muted-foreground/40"></lucide-icon>
              </div>
              <input 
                hlmInput 
                [ngModel]="searchQuery()"
                (ngModelChange)="searchQuery.set($event)"
                placeholder="Search by ID, Customer Phone..." 
                class="pl-11 w-full h-10 bg-muted/30 border-none rounded-xl focus:ring-1 ring-primary/20 placeholder:text-muted-foreground/30 font-bold text-xs"
              />
            </div>
            <div class="flex items-center gap-2 w-full sm:w-auto">
               <lucide-icon [img]="SortAsc" class="h-4 w-4 text-muted-foreground/40 ml-2"></lucide-icon>
               
               <!-- Custom Premium Dropdown -->
               <div class="relative">
                 <button 
                  (click)="isSortDropdownOpen.set(!isSortDropdownOpen())"
                  class="h-10 bg-muted/30 hover:bg-muted/50 transition-colors border-none rounded-xl px-4 flex items-center gap-3 font-black text-[9px] uppercase tracking-widest cursor-pointer"
                 >
                   <span>Sort by {{ sortBy() === 'createdAt' ? 'Date' : (sortBy() === 'total' ? 'Total' : 'Status') }}</span>
                   <lucide-icon [img]="ChevronDown" class="h-3 w-3 opacity-30"></lucide-icon>
                 </button>

                 @if (isSortDropdownOpen()) {
                   <div class="absolute left-0 top-12 w-48 bg-background border rounded-2xl shadow-2xl p-2 z-[60] animate-in fade-in zoom-in duration-200">
                     <button (click)="sortBy.set('createdAt'); isSortDropdownOpen.set(false)" class="w-full text-left px-4 py-2.5 rounded-xl transition-colors hover:bg-muted font-black text-[9px] uppercase tracking-widest" [class.text-primary]="sortBy() === 'createdAt'">Sort by Date</button>
                     <button (click)="sortBy.set('total'); isSortDropdownOpen.set(false)" class="w-full text-left px-4 py-2.5 rounded-xl transition-colors hover:bg-muted font-black text-[9px] uppercase tracking-widest" [class.text-primary]="sortBy() === 'total'">Sort by Total</button>
                     <button (click)="sortBy.set('status'); isSortDropdownOpen.set(false)" class="w-full text-left px-4 py-2.5 rounded-xl transition-colors hover:bg-muted font-black text-[9px] uppercase tracking-widest" [class.text-primary]="sortBy() === 'status'">Sort by Status</button>
                   </div>
                   <!-- Backdrop -->
                   <div class="fixed inset-0 z-[55]" (click)="isSortDropdownOpen.set(false)"></div>
                 }
               </div>

               <button 
                 hlmBtn variant="ghost" size="icon" 
                 (click)="toggleSortOrder()"
                 class="h-10 w-10 rounded-xl hover:bg-primary/5 text-primary"
               >
                 <lucide-icon [img]="sortOrder() === 'desc' ? ArrowDownWideNarrow : ArrowUpWideNarrow" class="h-4 w-4"></lucide-icon>
               </button>
            </div>
            <div class="h-4 w-px bg-border/40 hidden sm:block mx-2"></div>
            <div class="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
               <button *ngFor="let s of statusFilters" 
                       (click)="selectedStatus.set(s)"
                       [class]="selectedStatus() === s ? 'bg-primary text-primary-foreground' : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'"
                       class="px-4 h-10 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all whitespace-nowrap">
                 {{ s }}
               </button>
            </div>
        </div>

        <!-- Orders Table/Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
           <div class="lg:col-span-8 space-y-4">
              @for(order of filteredOrders(); track order.id) {
                <div hlmCard [class.border-l-4]="true" 
                     [class.border-l-amber-500]="order.status === 'pending'"
                     [class.border-l-green-500]="order.status === 'completed'"
                     [class.border-l-red-500]="order.status === 'cancelled'"
                     class="border-none shadow-sm rounded-2xl bg-background overflow-hidden hover:shadow-md transition-all group cursor-pointer"
                     (click)="selectedOrderId.set(order.id)">
                   <div hlmCardContent class="p-0">
                      <div class="flex flex-col sm:flex-row sm:items-center">
                         <!-- Order Identity -->
                         <div class="p-5 flex-1 border-b sm:border-b-0 sm:border-r border-border/40">
                            <div class="flex items-center justify-between mb-3">
                               <span class="text-[10px] font-black text-primary uppercase tracking-widest">#{{ order.id }}</span>
                               <span class="text-[9px] font-bold text-muted-foreground opacity-50">{{ order.createdAt | date:'shortTime' }}</span>
                            </div>
                            <div class="flex items-center gap-3">
                               <div class="h-10 w-10 rounded-xl bg-muted/30 flex items-center justify-center text-muted-foreground">
                                  <lucide-icon [img]="User" class="h-4 w-4"></lucide-icon>
                               </div>
                               <div>
                                  <p class="text-sm font-black text-foreground leading-tight">{{ order.customerPhone }}</p>
                                  <p class="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">{{ order.items?.length || 0 }} Items • COD Payment</p>
                               </div>
                            </div>
                         </div>

                         <!-- Status & Actions -->
                         <div class="p-5 flex items-center justify-between sm:w-64">
                            <div class="flex flex-col">
                               <p class="text-[9px] font-bold text-muted-foreground uppercase mb-1">Status</p>
                                <span [ngClass]="{
                                  'text-amber-600 bg-amber-50': order.status === 'pending',
                                  'text-green-600 bg-green-50': order.status === 'completed',
                                  'text-red-600 bg-red-50': order.status === 'cancelled'
                                }" class="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md w-fit">
                                  {{ order.status === 'pending' ? 'Initiated' : (order.status === 'completed' ? 'Delivered' : 'Cancelled') }}
                                </span>
                            </div>
                            <lucide-icon [img]="ChevronRight" class="h-5 w-5 text-muted-foreground/30 group-hover:text-primary transition-colors"></lucide-icon>
                         </div>
                      </div>
                   </div>
                </div>
              } @empty {
                <div class="bg-background rounded-2xl p-16 flex flex-col items-center gap-4 text-center border-none shadow-sm">
                   <div class="h-16 w-16 rounded-full bg-muted/30 flex items-center justify-center text-muted-foreground opacity-30">
                      <lucide-icon [img]="Package" class="h-8 w-8"></lucide-icon>
                   </div>
                   <div class="space-y-1">
                      <p class="font-black text-lg text-foreground tracking-tight">No orders found</p>
                      <p class="text-sm text-muted-foreground font-medium">Sit tight! New orders will appear here automatically.</p>
                   </div>
                </div>
              }
           </div>

           <!-- Details Sidebar -->
           <div class="lg:col-span-4">
              @if(selectedOrderDetails(); as order) {
                <div class="sticky top-24 space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                   <div hlmCard class="border-none shadow-md rounded-2xl bg-background overflow-hidden border-2 border-primary/5">
                      <div hlmCardHeader class="pb-3 border-b border-border/40">
                         <div class="flex items-center justify-between mb-2">
                           <h3 hlmCardTitle class="text-lg font-black tracking-tight">Order Details</h3>
                           <button (click)="selectedOrderId.set(null)" class="text-muted-foreground hover:text-primary transition-colors">
                              <lucide-icon [img]="XCircle" class="h-5 w-5"></lucide-icon>
                           </button>
                         </div>
                         <p class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">PLACED AT {{ order.createdAt | date:'medium' }}</p>
                      </div>
                      <div hlmCardContent class="p-0">
                         <!-- Customer Info -->
                         <div class="p-5 space-y-4 border-b border-border/40">
                            <div class="flex items-start gap-3">
                               <lucide-icon [img]="Phone" class="h-4 w-4 text-muted-foreground mt-0.5"></lucide-icon>
                               <div>
                                  <p class="text-[10px] font-bold text-muted-foreground uppercase mb-0.5">Contact</p>
                                  <p class="text-sm font-black">{{ order.customerPhone }}</p>
                               </div>
                            </div>
                         </div>

                         <!-- Items List -->
                         <div class="p-5 space-y-3">
                            <p class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Order Items</p>
                            @for(item of order.items; track item.product.id) {
                               <div class="flex items-center gap-3 bg-muted/20 p-2 rounded-xl border border-border/10">
                                  <img [src]="item.product.image" class="h-8 w-8 rounded-lg object-cover shadow-sm" />
                                  <div class="flex-1 min-w-0">
                                     <p class="text-xs font-black truncate leading-none mb-0.5">{{ item.product.title }}</p>
                                     <p class="text-[10px] text-muted-foreground font-medium">Qty: {{ item.quantity }} × {{ item.product.price | currency:'INR':'symbol':'1.2-2' }}</p>
                                  </div>
                                  <p class="text-xs font-black text-foreground">{{ (item.product.price * item.quantity) | currency:'INR':'symbol':'1.2-2' }}</p>
                               </div>
                            }
                            <div class="pt-3 mt-3 border-t border-dashed border-border flex items-center justify-between">
                               <p class="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total Amount</p>
                               <p class="text-xl font-black text-primary tracking-tighter">{{ order.total | currency:'INR':'symbol':'1.2-2' }}</p>
                            </div>
                         </div>

                         <!-- Action Panel -->
                         <div class="p-5 bg-muted/5 space-y-3">
                            <p class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Management Actions</p>
                            <div class="grid grid-cols-2 gap-2">
                               <button (click)="updateStatus('completed')" 
                                       [disabled]="order.status === 'completed' || order.status === 'cancelled' || orderStore.loading()"
                                       hlmBtn class="bg-green-600 hover:bg-green-700 text-white rounded-xl h-12 font-black text-[10px] uppercase tracking-widest shadow-sm shadow-green-200 border-none transition-all active:scale-95">
                                  <lucide-icon [img]="CheckCircle2" class="h-3.5 w-3.5 mr-2"></lucide-icon>
                                  Deliver
                               </button>
                               <button (click)="updateStatus('cancelled')" 
                                       [disabled]="order.status === 'cancelled' || order.status === 'completed' || orderStore.loading()"
                                       hlmBtn variant="outline" class="border-red-200 text-red-600 hover:bg-red-50 rounded-xl h-12 font-black text-[10px] uppercase tracking-widest transition-all active:scale-95">
                                  <lucide-icon [img]="XCircle" class="h-3.5 w-3.5 mr-2"></lucide-icon>
                                  Cancel
                               </button>
                            </div>
                            @if(order.status === 'completed') {
                               <div class="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-xl border border-green-100 animate-in zoom-in duration-300">
                                  <lucide-icon [img]="CheckCircle2" class="h-4 w-4"></lucide-icon>
                                  <p class="text-[10px] font-black uppercase tracking-tight">Order Fulfilled Successfully</p>
                               </div>
                            }
                         </div>
                      </div>
                   </div>
                </div>
              } @else {
                <div class="sticky top-24 h-[400px] border-2 border-dashed border-muted rounded-2xl flex flex-col items-center justify-center p-8 text-center bg-muted/5 opacity-50">
                   <div class="p-4 bg-muted/30 rounded-full mb-4">
                      <lucide-icon [img]="ShoppingBag" class="h-8 w-8 text-muted-foreground"></lucide-icon>
                   </div>
                   <p class="font-bold text-foreground mb-1">No Selection</p>
                   <p class="text-xs text-muted-foreground font-medium">Select an order from the list to view full details and fulfillment options.</p>
                </div>
              }
           </div>
        </div>
      </div>
    </div>
  `
})
export class AdminOrdersComponent implements OnInit {
   orderStore = inject(OrderStore);
   searchQuery = signal('');
   selectedStatus = signal('All');
   selectedOrderId = signal<string | null>(null);
   selectedOrderDetails = computed(() => this.orderStore.orders().find(o => o.id === this.selectedOrderId()) || null);
   statusFilters = ['All', 'Pending', 'Completed', 'Cancelled'];
   sortBy = signal<'createdAt' | 'total' | 'status'>('createdAt');
   sortOrder = signal<'asc' | 'desc'>('desc');
   isSortDropdownOpen = signal(false);

   toggleSortOrder() {
      this.sortOrder.update((s: any) => s === 'asc' ? 'desc' : 'asc');
   }

   filteredOrders = computed(() => {
      let orders = this.orderStore.orders().filter(order => {
         const matchesSearch = order.customerPhone.includes(this.searchQuery()) || order.id.toLowerCase().includes(this.searchQuery().toLowerCase());
         const matchesStatus = this.selectedStatus() === 'All' || order.status.toLowerCase() === this.selectedStatus().toLowerCase();
         return matchesSearch && matchesStatus;
      });

      // Apply Sorting
      const sortField = this.sortBy();
      const direction = this.sortOrder() === 'asc' ? 1 : -1;

      return [...orders].sort((a: any, b: any) => {
         let valA = a[sortField];
         let valB = b[sortField];

         // Handle special cases
         if (sortField === 'createdAt') {
            valA = new Date(valA).getTime();
            valB = new Date(valB).getTime();
         }

         if (valA < valB) return -1 * direction;
         if (valA > valB) return 1 * direction;
         return 0;
      });
   });

   ngOnInit() {
      this.orderStore.loadAdminOrders();
   }

   updateStatus(status: 'pending' | 'completed' | 'cancelled') {
      const orderId = this.selectedOrderId();
      if (!orderId) return;
      this.orderStore.updateStatus({ orderId, status });
   }

   readonly ShoppingBag = ShoppingBag;
   readonly Clock = Clock;
   readonly CheckCircle2 = CheckCircle2;
   readonly XCircle = XCircle;
   readonly Search = Search;
   readonly ChevronRight = ChevronRight;
   readonly Package = Package;
   readonly User = User;
   readonly Phone = Phone;
   readonly MapPin = MapPin;
   readonly ExternalLink = ExternalLink;
   readonly Filter = Filter;
   readonly SortAsc = SortAsc;
   readonly ArrowUpWideNarrow = ArrowUpWideNarrow;
   readonly ArrowDownWideNarrow = ArrowDownWideNarrow;
   readonly ChevronDown = ChevronRight; // We'll use ChevronRight rotated if possible or just ChevronRight
}
