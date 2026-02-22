import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserStore } from '../../../store/user.store';
import { HlmCardDirective, HlmCardHeaderDirective, HlmCardTitleDirective, HlmCardContentDirective, HlmCardFooterDirective } from '../../../ui/ui-card/ui-card.directive';
import { HlmButtonDirective } from '../../../ui/ui-button/ui-button.directive';
import { HlmInputDirective } from '../../../ui/ui-input/ui-input.directive';
import { LucideAngularModule, ShieldAlert, Lock, ArrowLeft } from 'lucide-angular';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HlmCardDirective,
    HlmCardHeaderDirective,
    HlmCardTitleDirective,
    HlmCardContentDirective,
    HlmCardFooterDirective,
    HlmButtonDirective,
    HlmInputDirective,
    LucideAngularModule
  ],
  template: `
    <div class="container flex items-center justify-center min-h-[80vh] px-4">
      <div hlmCard class="w-full max-w-md border-none sm:border shadow-2xl">
        <div hlmCardHeader class="flex flex-col items-center pb-8 border-b">
          <div class="p-4 bg-primary/10 rounded-full mb-4">
            <lucide-icon [img]="ShieldAlert" class="h-10 w-10 text-primary"></lucide-icon>
          </div>
          <div hlmCardTitle class="text-3xl font-black tracking-tight">Admin Portal</div>
          <p class="text-sm text-muted-foreground mt-2">Restricted Access. Authentication Required.</p>
        </div>

        <div hlmCardContent class="space-y-6 pt-8 pb-4">
          <div class="space-y-4">
            <div class="space-y-2">
              <label class="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Admin Password</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <lucide-icon [img]="Lock" class="h-5 w-5 text-muted-foreground"></lucide-icon>
                </div>
                <input 
                  hlmInput 
                  type="password" 
                  [(ngModel)]="password" 
                  placeholder="••••••••••••" 
                  class="pl-12 w-full h-14 text-lg rounded-2xl"
                  (keyup.enter)="login()"
                />
              </div>
            </div>
          </div>

          @if (error()) {
            <div class="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-4 rounded-xl font-medium animate-in fade-in slide-in-from-top-2">
              Incorrect password. Please try again or contact the system administrator.
            </div>
          }
        </div>

        <div hlmCardFooter class="flex flex-col gap-4 pt-4 pb-8">
          <button 
            hlmBtn 
            class="w-full h-14 text-lg font-black rounded-2xl shadow-xl hover:shadow-primary/20 transition-all" 
            [disabled]="!password()"
            (click)="login()"
          >
            Authenticate
          </button>
          
          <a routerLink="/" class="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2">
            <lucide-icon [img]="ArrowLeft" class="h-4 w-4"></lucide-icon>
            Back to Public Site
          </a>
        </div>
      </div>
    </div>
  `
})
export class AdminLoginComponent {
  userStore = inject(UserStore);
  router = inject(Router);
  password = signal('');
  error = signal(false);

  login() {
    this.error.set(false);
    const success = this.userStore.verifyAdminPassword(this.password());
    if (success) {
      this.router.navigate(['/admin']);
    } else {
      this.error.set(true);
      this.password.set('');
    }
  }

  readonly ShieldAlert = ShieldAlert;
  readonly Lock = Lock;
  readonly ArrowLeft = ArrowLeft;
}
