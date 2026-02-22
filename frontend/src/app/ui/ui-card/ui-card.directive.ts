import { Directive, Input, computed, signal } from '@angular/core';
import { cn } from '../../lib/utils';

@Directive({
    selector: '[hlmCard]',
    standalone: true,
    host: {
        '[class]': 'computedClass()',
    },
})
export class HlmCardDirective {
    private readonly _userClass = signal('');
    @Input('class')
    set userClass(userClass: string) {
        this._userClass.set(userClass);
    }

    protected computedClass = computed(() =>
        cn('rounded-lg border bg-card text-card-foreground shadow-sm flex flex-col', this._userClass())
    );
}

@Directive({
    selector: '[hlmCardHeader]',
    standalone: true,
    host: {
        '[class]': 'computedClass()',
    },
})
export class HlmCardHeaderDirective {
    private readonly _userClass = signal('');
    @Input('class')
    set userClass(userClass: string) {
        this._userClass.set(userClass);
    }

    protected computedClass = computed(() =>
        cn('flex flex-col space-y-1.5 p-6', this._userClass())
    );
}

@Directive({
    selector: '[hlmCardTitle]',
    standalone: true,
    host: {
        '[class]': 'computedClass()',
    },
})
export class HlmCardTitleDirective {
    private readonly _userClass = signal('');
    @Input('class')
    set userClass(userClass: string) {
        this._userClass.set(userClass);
    }

    protected computedClass = computed(() =>
        cn('text-2xl font-semibold leading-none tracking-tight', this._userClass())
    );
}

@Directive({
    selector: '[hlmCardDescription]',
    standalone: true,
    host: {
        '[class]': 'computedClass()',
    },
})
export class HlmCardDescriptionDirective {
    private readonly _userClass = signal('');
    @Input('class')
    set userClass(userClass: string) {
        this._userClass.set(userClass);
    }

    protected computedClass = computed(() =>
        cn('text-sm text-muted-foreground', this._userClass())
    );
}

@Directive({
    selector: '[hlmCardContent]',
    standalone: true,
    host: {
        '[class]': 'computedClass()',
    },
})
export class HlmCardContentDirective {
    private readonly _userClass = signal('');
    @Input('class')
    set userClass(userClass: string) {
        this._userClass.set(userClass);
    }

    protected computedClass = computed(() =>
        cn('p-6 pt-0', this._userClass())
    );
}

@Directive({
    selector: '[hlmCardFooter]',
    standalone: true,
    host: {
        '[class]': 'computedClass()',
    },
})
export class HlmCardFooterDirective {
    private readonly _userClass = signal('');
    @Input('class')
    set userClass(userClass: string) {
        this._userClass.set(userClass);
    }

    protected computedClass = computed(() =>
        cn('flex items-center p-6 pt-0', this._userClass())
    );
}
