import { Directive, Input, computed, signal } from '@angular/core';
import { cn } from '../../lib/utils';

@Directive({
    selector: '[hlmInput]',
    standalone: true,
    host: {
        '[class]': 'computedClass()',
    },
})
export class HlmInputDirective {
    private readonly _userClass = signal('');
    @Input('class')
    set userClass(userClass: string) {
        this._userClass.set(userClass);
    }

    protected computedClass = computed(() =>
        cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            this._userClass()
        )
    );
}
