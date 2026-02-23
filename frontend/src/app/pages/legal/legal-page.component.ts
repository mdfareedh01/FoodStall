import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HlmCardDirective, HlmCardHeaderDirective, HlmCardTitleDirective, HlmCardContentDirective } from '../../ui/ui-card/ui-card.directive';
import { LucideAngularModule, FileText, Shield, Truck, XCircle } from 'lucide-angular';

@Component({
  selector: 'app-legal-page',
  standalone: true,
  imports: [CommonModule, HlmCardDirective, HlmCardHeaderDirective, HlmCardTitleDirective, HlmCardContentDirective, LucideAngularModule],
  template: `
    <div class="container py-12 max-w-4xl">
      <div hlmCard>
        <div hlmCardHeader class="border-b pb-6">
          <div class="flex items-center gap-4">
             <div class="p-3 bg-primary/10 rounded-lg">
                <lucide-icon [img]="getIcon()" class="h-8 w-8 text-primary"></lucide-icon>
             </div>
             <div>
                <h1 hlmCardTitle class="text-3xl font-bold">{{ title }}</h1>
                <p class="text-sm text-muted-foreground">Last updated: February 2026</p>
             </div>
          </div>
        </div>
        <div hlmCardContent class="pt-8">
          <div class="prose prose-zinc dark:prose-invert max-w-none">
            <div *ngFor="let paragraph of paragraphs" class="mb-4 text-muted-foreground leading-relaxed">
              {{ paragraph }}
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LegalPageComponent {
  private route = inject(ActivatedRoute);
  title: string = 'Legal Policy';
  type: string = 'terms';
  paragraphs: string[] = [];

  constructor() {
    const data = this.route.snapshot.data;
    this.title = data['title'] || 'Legal Policy';
    this.type = data['type'] || 'terms';
    const rawContent = data['content'] || '';
    this.paragraphs = rawContent.split('\n\n').filter((p: string) => p.trim().length > 0);
  }

  getIcon() {
    switch (this.type) {
      case 'terms': return FileText;
      case 'privacy': return Shield;
      case 'shipping': return Truck;
      case 'cancellation': return XCircle;
      default: return FileText;
    }
  }

  readonly FileText = FileText;
  readonly Shield = Shield;
  readonly Truck = Truck;
  readonly XCircle = XCircle;
}
