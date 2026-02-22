import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserStore } from '../../store/user.store';
import { HlmButtonDirective } from '../../ui/ui-button/ui-button.directive';
import { HlmInputDirective } from '../../ui/ui-input/ui-input.directive';
import { HlmCardDirective, HlmCardHeaderDirective, HlmCardTitleDirective, HlmCardContentDirective, HlmCardFooterDirective } from '../../ui/ui-card/ui-card.directive';
import { LucideAngularModule, Phone, ShieldCheck, Loader2, ArrowLeft } from 'lucide-angular';
import { Router } from '@angular/router';
import { shake, fadeAnimation } from '../../animations';

@Component({
  selector: 'app-otp-auth',
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
    HlmCardFooterDirective,
    LucideAngularModule
  ],
  animations: [shake, fadeAnimation],
  template: `
    <div class="container flex items-center justify-center min-h-[80vh]">
      <div hlmCard [@shake]="errorCount()" class="w-full max-w-md">
        <div hlmCardHeader>
          <div hlmCardTitle class="flex items-center gap-2">
            @if (step() === 'otp') {
              <button hlmBtn variant="ghost" size="icon" (click)="step.set('phone')" class="h-8 w-8">
                <lucide-icon [img]="ArrowLeft" class="h-4 w-4"></lucide-icon>
              </button>
            }
            {{ step() === 'phone' ? 'Login' : 'Verify OTP' }}
          </div>
          <p class="text-sm text-muted-foreground">
            {{ step() === 'phone' ? 'Enter your phone number to continue' : 'We sent a 6-digit code to ' + phone() }}
          </p>
        </div>

        <div hlmCardContent class="space-y-4 pt-4">
          @if (step() === 'phone') {
            <div class="space-y-2">
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <lucide-icon [img]="Phone" class="h-5 w-5 text-muted-foreground"></lucide-icon>
                </div>
                <input 
                  hlmInput 
                  type="tel" 
                  placeholder="98765 43210" 
                  [(ngModel)]="phone" 
                  class="pl-12 w-full h-14 text-lg rounded-2xl"
                  (keyup.enter)="requestOtp()"
                />
              </div>
              <p class="text-xs text-muted-foreground italic">* Use any 10-digit number. Try 9999999999 for Admin.</p>
            </div>
          } @else {
            <div class="space-y-4">
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <lucide-icon [img]="ShieldCheck" class="h-5 w-5 text-muted-foreground"></lucide-icon>
                </div>
                <input 
                  hlmInput 
                  type="text" 
                  maxLength="6"
                  placeholder="123456" 
                  [(ngModel)]="otp" 
                  class="pl-12 w-full h-14 tracking-[0.5em] text-center font-bold text-lg rounded-2xl"
                  (keyup.enter)="verifyOtp()"
                />
              </div>
              @if (userStore.error()) {
                <p [@fadeAnimation] class="text-sm text-destructive font-medium">{{ userStore.error() }}</p>
              }
              <p class="text-xs text-muted-foreground italic">* Dev Mode: Use 123456</p>
            </div>
          }
        </div>

        <div hlmCardFooter class="flex flex-col gap-2 pt-6">
          @if (step() === 'phone') {
            <button 
              hlmBtn 
              class="w-full" 
              [disabled]="!isValidPhone() || userStore.status() === 'requesting'"
              (click)="requestOtp()"
            >
              @if (userStore.status() === 'requesting') {
                <lucide-icon [img]="Loader2" class="mr-2 h-4 w-4 animate-spin"></lucide-icon>
                Sending...
              } @else {
                Get OTP
              }
            </button>
          } @else {
            <button 
              hlmBtn 
              class="w-full" 
              [disabled]="otp().length !== 6 || userStore.status() === 'verifying'"
              (click)="verifyOtp()"
            >
              @if (userStore.status() === 'verifying') {
                <lucide-icon [img]="Loader2" class="mr-2 h-4 w-4 animate-spin"></lucide-icon>
                Verifying...
              } @else {
                Verify & Login
              }
            </button>
          }
          <p class="text-xs text-center text-muted-foreground pt-4">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  `
})
export class OtpAuthComponent {
  userStore = inject(UserStore);
  router = inject(Router);

  step = signal<'phone' | 'otp'>('phone');
  phone = signal('');
  otp = signal('');

  isValidPhone = () => /^[6-9]\d{9}$/.test(this.phone());

  requestOtp() {
    if (!this.isValidPhone()) return;
    this.userStore.requestOtp(this.phone());
    this.step.set('otp');
  }

  verifyOtp() {
    if (this.otp().length !== 6) return;
    this.userStore.verifyOtp(this.phone(), this.otp());
  }

  errorCount = signal(0);

  constructor() {
    effect(() => {
      if (this.userStore.error()) {
        this.errorCount.update(c => c + 1);
      }
    });

    effect(() => {
      if (this.userStore.token()) {
        this.router.navigate(['/']);
      }
    });
  }

  readonly Phone = Phone;
  readonly ShieldCheck = ShieldCheck;
  readonly Loader2 = Loader2;
  readonly ArrowLeft = ArrowLeft;
}
