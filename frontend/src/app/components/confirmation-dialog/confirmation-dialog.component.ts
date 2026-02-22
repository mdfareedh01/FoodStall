import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, AlertTriangle, Info, Trash2, HelpCircle } from 'lucide-angular';
import { HlmButtonDirective } from '../../ui/ui-button/ui-button.directive';

export type DialogVariant = 'primary' | 'destructive' | 'warning';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, HlmButtonDirective],
  template: `
    <div class="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300" (click)="cancel.emit()"></div>
      
      <div class="relative bg-background border rounded-2xl shadow-2xl p-6 max-w-[340px] w-full animate-in zoom-in-95 slide-in-from-bottom-2 duration-200">
        <div class="flex flex-col items-center text-center space-y-4">
          <!-- Icon Header -->
          <div [ngClass]="getIconContainerClass()" class="p-3.5 rounded-xl animate-in fade-in zoom-in duration-300">
            <lucide-icon [img]="getIcon()" class="h-6 w-6"></lucide-icon>
          </div>

          <!-- Content -->
          <div class="space-y-1">
            <h3 class="text-xl font-black tracking-tight text-foreground">{{ title }}</h3>
            <p class="text-xs text-muted-foreground font-medium leading-relaxed px-2">
              {{ message }}
            </p>
          </div>

          <!-- Actions -->
          <div class="flex flex-col w-full gap-2 pt-2">
            <button 
              (click)="confirm.emit()" 
              hlmBtn 
              [variant]="variant === 'destructive' ? 'destructive' : 'default'"
              class="h-11 rounded-xl font-black text-sm shadow-lg transition-all active:scale-95"
              [ngClass]="variant === 'primary' ? 'shadow-primary/10' : variant === 'destructive' ? 'shadow-destructive/10' : 'shadow-amber-500/10 bg-amber-500 hover:bg-amber-600 border-none text-white'"
            >
              {{ confirmLabel }}
            </button>
            <button 
              (click)="cancel.emit()" 
              hlmBtn 
              variant="ghost" 
              class="h-10 rounded-xl font-bold text-xs border-none transition-colors hover:bg-muted"
            >
              {{ cancelLabel }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ConfirmationDialogComponent {
  @Input() title = 'Are you sure?';
  @Input() message = 'This action cannot be undone.';
  @Input() confirmLabel = 'Confirm';
  @Input() cancelLabel = 'Cancel';
  @Input() variant: DialogVariant = 'primary';

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  getIcon() {
    switch (this.variant) {
      case 'destructive': return Trash2;
      case 'warning': return AlertTriangle;
      case 'primary': return Info;
      default: return HelpCircle;
    }
  }

  getIconContainerClass() {
    switch (this.variant) {
      case 'destructive': return 'bg-destructive/10 text-destructive';
      case 'warning': return 'bg-amber-500/10 text-amber-500';
      case 'primary': return 'bg-primary/10 text-primary';
      default: return 'bg-muted text-muted-foreground';
    }
  }

  readonly Trash2 = Trash2;
  readonly AlertTriangle = AlertTriangle;
  readonly Info = Info;
  readonly HelpCircle = HelpCircle;
}
