import { Directive, Input, computed, signal } from '@angular/core';
import { cn } from '../../lib/utils';
import { badgeVariants, BadgeVariants } from './ui-badge.variants';

@Directive({
    selector: '[hlmBadge]',
    standalone: true,
    host: {
        '[class]': 'computedClass()',
    },
})
export class HlmBadgeDirective {
    private readonly _variant = signal<BadgeVariants['variant']>('default');
    @Input()
    set variant(value: BadgeVariants['variant']) {
        this._variant.set(value);
    }

    private readonly _userClass = signal('');
    @Input('class')
    set userClass(value: string) {
        this._userClass.set(value);
    }

    protected computedClass = computed(() => {
        return cn(badgeVariants({ variant: this._variant() }), this._userClass());
    });
}
