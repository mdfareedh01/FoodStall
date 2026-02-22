import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HlmButtonDirective } from '../../ui/ui-button/ui-button.directive';
import { LucideAngularModule } from 'lucide-angular';

@Component({
    selector: 'app-empty-state',
    standalone: true,
    imports: [CommonModule, RouterLink, HlmButtonDirective, LucideAngularModule],
    template: `
    <div class="text-center py-20 border rounded-lg border-dashed bg-muted/10">
      <lucide-icon [img]="icon" class="h-12 w-12 mx-auto text-muted-foreground mb-4"></lucide-icon>
      <h2 class="text-xl font-semibold mb-2">{{ title }}</h2>
      <p class="text-muted-foreground mb-6">{{ description }}</p>
      @if (actionLabel && actionLink) {
        <a [routerLink]="actionLink" hlmBtn variant="default">{{ actionLabel }}</a>
      }
    </div>
  `
})
export class EmptyStateComponent {
    @Input({ required: true }) icon!: any;
    @Input({ required: true }) title!: string;
    @Input({ required: true }) description!: string;
    @Input() actionLabel?: string;
    @Input() actionLink?: string;
}
