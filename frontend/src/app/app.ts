import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { fadeAnimation } from './animations';
import { CommonModule } from '@angular/common';
import { inject } from '@angular/core';
import { ChildrenOutletContexts } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  animations: [fadeAnimation],
  template: `
    <div class="min-h-screen bg-background font-sans antialiased text-foreground">
      <app-navbar></app-navbar>
      <main [@fadeAnimation]="getRouteAnimationData()">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class App {
  protected readonly title = signal('A to Z Foods');
  private contexts = inject(ChildrenOutletContexts);

  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }
}
