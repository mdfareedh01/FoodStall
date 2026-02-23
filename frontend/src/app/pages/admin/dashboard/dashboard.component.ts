import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HlmCardDirective, HlmCardHeaderDirective, HlmCardTitleDirective, HlmCardContentDirective } from '../../../ui/ui-card/ui-card.directive';
import { HlmButtonDirective } from '../../../ui/ui-button/ui-button.directive';
import { LucideAngularModule, LayoutDashboard, Package, ShoppingBag, CreditCard, ArrowUpRight, TrendingUp, Users, Banknote, Lock } from 'lucide-angular';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, HlmCardDirective, HlmCardHeaderDirective, HlmCardTitleDirective, HlmCardContentDirective, LucideAngularModule, RouterLink],
  template: `
    <div class="min-h-screen bg-muted/20">
      <div class="container py-6 sm:py-8 px-4 sm:px-8">
        <div class="flex flex-col gap-2 mb-8">
          <h1 class="text-3xl font-extrabold flex items-center gap-3 tracking-tight text-foreground">
            <lucide-icon [img]="LayoutDashboard" class="h-8 w-8 text-primary"></lucide-icon>
            Admin Dashboard
          </h1>
          <p class="text-sm text-muted-foreground flex items-center gap-2 font-medium">
            <span class="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            System Online • Welcome, Admin
          </p>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
          <div hlmCard class="border-none shadow-sm hover:shadow-md transition-shadow bg-background">
            <div hlmCardHeader class="pb-2 flex flex-row items-center justify-between space-y-0">
              <p class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total Revenue</p>
              <lucide-icon [img]="Banknote" class="h-4 w-4 text-primary"></lucide-icon>
            </div>
            <div hlmCardContent>
              <div class="text-2xl font-black tracking-tight">₹1,12,845</div>
              <p class="text-[10px] text-green-600 font-bold flex items-center gap-1 mt-1 bg-green-50 w-fit px-2 py-0.5 rounded-full">
                <lucide-icon [img]="ArrowUpRight" class="h-3 w-3"></lucide-icon> +12.5%
              </p>
            </div>
          </div>

          <div hlmCard class="border-none shadow-sm hover:shadow-md transition-shadow bg-background">
            <div hlmCardHeader class="pb-2 flex flex-row items-center justify-between space-y-0">
              <p class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Active Orders</p>
              <lucide-icon [img]="ShoppingBag" class="h-4 w-4 text-primary"></lucide-icon>
            </div>
            <div hlmCardContent>
              <div class="text-2xl font-black tracking-tight">154</div>
              <p class="text-[10px] text-green-600 font-bold flex items-center gap-1 mt-1 bg-green-50 w-fit px-2 py-0.5 rounded-full">
                <lucide-icon [img]="ArrowUpRight" class="h-3 w-3"></lucide-icon> +5.2%
              </p>
            </div>
          </div>

          <div hlmCard class="border-none shadow-sm hover:shadow-md transition-shadow bg-background">
            <div hlmCardHeader class="pb-2 flex flex-row items-center justify-between space-y-0">
              <p class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">New Users</p>
              <lucide-icon [img]="Users" class="h-4 w-4 text-primary"></lucide-icon>
            </div>
            <div hlmCardContent>
              <div class="text-2xl font-black tracking-tight">89</div>
              <p class="text-[10px] text-green-600 font-bold flex items-center gap-1 mt-1 bg-green-50 w-fit px-2 py-0.5 rounded-full">
                <lucide-icon [img]="ArrowUpRight" class="h-3 w-3"></lucide-icon> +20%
              </p>
            </div>
          </div>

          <div hlmCard class="border-none shadow-sm hover:shadow-md transition-shadow bg-background">
            <div hlmCardHeader class="pb-2 flex flex-row items-center justify-between space-y-0">
              <p class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Avg Value</p>
              <lucide-icon [img]="TrendingUp" class="h-4 w-4 text-primary"></lucide-icon>
            </div>
            <div hlmCardContent>
              <div class="text-2xl font-black tracking-tight">₹834.00</div>
              <p class="text-[10px] text-muted-foreground font-medium mt-1">Consistent growth</p>
            </div>
          </div>
        </div>

        <!-- Management Links -->
        <h2 class="text-xl font-black mb-6 flex items-center gap-2">
            Store Management
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <a hlmCard class="border-none shadow-sm hover:shadow-md transition-all cursor-pointer group hover:bg-primary/[0.02] bg-background" routerLink="/admin/products">
              <div hlmCardHeader class="p-6">
                  <div class="p-3 bg-primary/10 rounded-2xl w-fit group-hover:scale-110 transition-transform mb-4">
                    <lucide-icon [img]="Package" class="h-8 w-8 text-primary"></lucide-icon>
                  </div>
                  <div hlmCardTitle class="text-lg font-black tracking-tight">Product Catalog</div>
                  <p class="text-sm text-muted-foreground leading-relaxed mt-1 font-medium">Add, edit, or remove food items and update pricing.</p>
              </div>
          </a>

          <a hlmCard class="border-none shadow-sm hover:shadow-md transition-all cursor-pointer group hover:bg-primary/[0.02] bg-background" routerLink="/admin/orders">
              <div hlmCardHeader class="p-6">
                  <div class="p-3 bg-primary/10 rounded-2xl w-fit group-hover:scale-110 transition-transform mb-4">
                    <lucide-icon [img]="ShoppingBag" class="h-8 w-8 text-primary"></lucide-icon>
                  </div>
                  <div hlmCardTitle class="text-lg font-black tracking-tight">Order Fulfillment</div>
                  <p class="text-sm text-muted-foreground leading-relaxed mt-1 font-medium">Manage active orders, set status, and track delivery.</p>
              </div>
          </a>

          <!-- Greyed out Log Card -->
          <div hlmCard class="border-none shadow-sm opacity-50 bg-muted/30 grayscale cursor-not-allowed sm:col-span-2 lg:col-span-1 relative overflow-hidden group">
              <div hlmCardHeader class="p-6">
                  <div class="p-3 bg-muted rounded-2xl w-fit mb-4">
                    <lucide-icon [img]="CreditCard" class="h-8 w-8 text-muted-foreground"></lucide-icon>
                  </div>
                  <div class="flex items-center gap-2">
                    <div hlmCardTitle class="text-lg font-black tracking-tight text-muted-foreground">Financial Logs</div>
                    <span class="text-[9px] font-bold uppercase tracking-tighter bg-muted-foreground/10 text-muted-foreground px-2 py-0.5 rounded-full">Coming Soon</span>
                  </div>
                  <p class="text-sm text-muted-foreground leading-relaxed mt-1 font-medium">Detailed history of COD transactions and future payments.</p>
              </div>
              <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-background/20 backdrop-blur-[1px]">
                 <lucide-icon [img]="Lock" class="h-10 w-10 text-muted-foreground/40"></lucide-icon>
              </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminDashboardComponent {
  readonly LayoutDashboard = LayoutDashboard;
  readonly Package = Package;
  readonly ShoppingBag = ShoppingBag;
  readonly CreditCard = CreditCard;
  readonly ArrowUpRight = ArrowUpRight;
  readonly TrendingUp = TrendingUp;
  readonly Users = Users;
  readonly Banknote = Banknote;
  readonly Lock = Lock;
}
