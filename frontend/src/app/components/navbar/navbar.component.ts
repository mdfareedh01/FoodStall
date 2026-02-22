import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartStore } from '../../store/cart.store';
import { UserStore } from '../../store/user.store';
import { HlmButtonDirective } from '../../ui/ui-button/ui-button.directive';
import { HlmBadgeDirective } from '../../ui/ui-badge/ui-badge.directive';
import { LucideAngularModule, ShoppingCart, User, Store, Package, LogOut, Menu, X } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { cartPop } from '../../animations';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, HlmButtonDirective, HlmBadgeDirective, LucideAngularModule],
  animations: [cartPop],
  template: `
    <nav class="border-b bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div class="container flex h-14 items-center justify-between px-4 sm:px-8">
        <div class="flex items-center gap-4 sm:gap-6">
          <button 
            hlmBtn variant="ghost" size="icon" 
            class="md:hidden h-8 w-8" 
            (click)="isMenuOpen.set(true)"
          >
            <lucide-icon [img]="MenuIcon" class="h-5 w-5"></lucide-icon>
          </button>

          <a routerLink="/" class="flex items-center gap-2 font-bold text-lg text-foreground" (click)="isMenuOpen.set(false)">
            <lucide-icon [img]="Store" class="h-6 w-6 text-primary"></lucide-icon>
            <span>A to Z Foods</span>
          </a>

          <div class="hidden md:flex gap-6 text-sm font-medium">
            <a routerLink="/" routerLinkActive="text-foreground" [routerLinkActiveOptions]="{exact: true}" class="text-muted-foreground transition-colors hover:text-foreground">Home</a>
            <a routerLink="/orders" routerLinkActive="text-foreground" class="text-muted-foreground transition-colors hover:text-foreground">Orders</a>
          </div>
        </div>

        <div class="flex items-center gap-1 sm:gap-2">
          <a routerLink="/cart" hlmBtn variant="ghost" size="icon" class="relative" (click)="isMenuOpen.set(false)">
            <lucide-icon [img]="ShoppingCart" class="h-5 w-5"></lucide-icon>
            @if (cartStore.count() > 0) {
              <span 
                [@cartPop]="cartStore.count()"
                hlmBadge 
                class="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full px-0 text-[10px] min-w-[20px] shadow-sm shadow-primary/20"
              >
                {{ cartStore.count() }}
              </span>
            }
          </a>
          
          <div class="hidden sm:flex items-center gap-2">
            @if (userStore.user()) {
              <div class="flex items-center gap-2 pr-2 border-r mr-2">
                <span class="text-xs font-medium text-muted-foreground">
                  {{ userStore.user()?.phoneNumber }}
                </span>
                <button hlmBtn variant="ghost" size="icon" (click)="userStore.logout(); isMenuOpen.set(false)">
                  <lucide-icon [img]="LogOut" class="h-4 w-4"></lucide-icon>
                </button>
              </div>
            } @else {
              <a routerLink="/login" hlmBtn variant="ghost" size="icon" (click)="isMenuOpen.set(false)">
                <lucide-icon [img]="User" class="h-5 w-5"></lucide-icon>
              </a>
            }

            @if (userStore.user()?.role === 'ADMIN') {
              <a routerLink="/admin" hlmBtn variant="outline" size="sm" class="hidden sm:flex">Admin</a>
            }
          </div>

          <!-- Mobile User Icon (visible if logout) -->
          @if (!userStore.user()) {
            <a routerLink="/login" hlmBtn variant="ghost" size="icon" class="sm:hidden">
              <lucide-icon [img]="User" class="h-5 w-5"></lucide-icon>
            </a>
          }
        </div>
      </div>
    </nav>

    <!-- Mobile Drawer -->
    <div 
      class="fixed inset-0 z-[60] md:hidden transition-all duration-300"
      [class.invisible]="!isMenuOpen()"
    >
      <!-- Backdrop -->
      <div 
        class="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
        [class.opacity-0]="!isMenuOpen()"
        [class.opacity-100]="isMenuOpen()"
        (click)="isMenuOpen.set(false)"
      ></div>

      <!-- Drawer Content -->
      <div 
        class="absolute inset-y-0 left-0 w-3/4 max-w-sm bg-background border-r p-6 shadow-xl transition-transform duration-300 ease-in-out"
        [class.-translate-x-full]="!isMenuOpen()"
        [class.translate-x-0]="isMenuOpen()"
      >
        <div class="flex items-center justify-between mb-8">
          <div class="flex items-center gap-2 font-bold text-lg">
            <lucide-icon [img]="Store" class="h-6 w-6 text-primary"></lucide-icon>
            <span>A to Z Foods</span>
          </div>
          <button hlmBtn variant="ghost" size="icon" (click)="isMenuOpen.set(false)">
            <lucide-icon [img]="XIcon" class="h-5 w-5"></lucide-icon>
          </button>
        </div>

        <div class="space-y-4">
          <a 
            routerLink="/" 
            routerLinkActive="bg-accent text-accent-foreground" 
            [routerLinkActiveOptions]="{exact: true}"
            class="flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent"
            (click)="isMenuOpen.set(false)"
          >
            Home
          </a>
          <a 
            routerLink="/orders" 
            routerLinkActive="bg-accent text-accent-foreground"
            class="flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent"
            (click)="isMenuOpen.set(false)"
          >
            Orders
          </a>
          @if (userStore.user()?.role === 'ADMIN') {
            <a 
              routerLink="/admin" 
              routerLinkActive="bg-accent text-accent-foreground"
              class="flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent text-primary"
              (click)="isMenuOpen.set(false)"
            >
              Admin Dashboard
            </a>
          }
        </div>

        <div class="absolute bottom-6 left-6 right-6 pt-6 border-t">
          @if (userStore.user()) {
            <div class="flex items-center justify-between">
              <div class="flex flex-col">
                <span class="text-xs text-muted-foreground uppercase tracking-wider font-bold">Logged in as</span>
                <span class="text-sm font-medium">{{ userStore.user()?.phoneNumber }}</span>
              </div>
              <button hlmBtn variant="destructive" size="sm" (click)="userStore.logout(); isMenuOpen.set(false)">
                <lucide-icon [img]="LogOut" class="h-4 w-4 mr-2"></lucide-icon> Logout
              </button>
            </div>
          } @else {
            <a 
              routerLink="/login" 
              hlmBtn 
              class="w-full"
              (click)="isMenuOpen.set(false)"
            >
              Login to Continue
            </a>
          }
        </div>
      </div>
    </div>
  `
})
export class NavbarComponent {
  cartStore = inject(CartStore);
  userStore = inject(UserStore);

  isMenuOpen = signal(false);

  readonly ShoppingCart = ShoppingCart;
  readonly User = User;
  readonly Store = Store;
  readonly Package = Package;
  readonly LogOut = LogOut;
  readonly MenuIcon = Menu;
  readonly XIcon = X;
}
