import { Directive, Input, computed, signal } from '@angular/core';
import { cn } from '../../lib/utils';
import { buttonVariants, ButtonVariants } from './ui-button.variants';

@Directive({
    selector: '[hlmBtn]',
    standalone: true,
    host: {
        '[class]': 'computedClass()',
    },
})
export class HlmButtonDirective {
    private readonly _variant = signal<ButtonVariants['variant']>('default');
    @Input()
    set variant(value: ButtonVariants['variant']) {
        this._variant.set(value);
    }

    private readonly _size = signal<ButtonVariants['size']>('default');
    @Input()
    set size(value: ButtonVariants['size']) {
        this._size.set(value);
    }

    private readonly _userClass = signal('');
    @Input('class')
    set userClass(value: string) {
        this._userClass.set(value);
    }

    protected computedClass = computed(() => {
        return cn(buttonVariants({ variant: this._variant(), size: this._size() }), this._userClass());
    });
}
