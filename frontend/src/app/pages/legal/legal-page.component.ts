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
        <div hlmCardContent class="prose prose-zinc dark:prose-invert max-w-none pt-8 space-y-6">
          <section>
            <h3 class="text-xl font-bold mb-3">1. Overview</h3>
            <p class="text-muted-foreground leading-relaxed">
              Welcome to A to Z Foods. This {{ title }} governs your use of our website and services. 
              By accessing our platform, you agree to be bound by these conditions. 
              We are committed to providing a transparent and secure food ordering experience.
            </p>
          </section>

          <section>
            <h3 class="text-xl font-bold mb-3">2. Important Terms</h3>
            <p class="text-muted-foreground leading-relaxed">
              Our service connects food lovers with the best local cuisines. 
              All orders are subject to availability and delivery feasibility. 
              We reserve the right to modify these terms at any time without prior notice.
            </p>
          </section>

          <section>
            <h3 class="text-xl font-bold mb-3">3. Liability</h3>
            <p class="text-muted-foreground leading-relaxed">
              A to Z Foods acts as an intermediary. While we strive for quality, 
              individual product quality is the responsibility of the preparing kitchen. 
              Detailed allergy information is provided on each product page.
            </p>
          </section>

          <section>
            <h3 class="text-xl font-bold mb-3">4. Contact Us</h3>
            <p class="text-muted-foreground leading-relaxed">
              For any queries regarding our {{ title }}, please contact our support team at 
              support@atozfoods.com or call our 24/7 helpline.
            </p>
          </section>
        </div>
      </div>
    </div>
  `
})
export class LegalPageComponent {
  private route = inject(ActivatedRoute);
  title: string = 'Legal Policy';
  type: string = 'terms';

  constructor() {
    const data = this.route.snapshot.data;
    this.title = data['title'] || 'Legal Policy';
    this.type = data['type'] || 'terms';
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
