import { animate, query, stagger, style, transition, trigger } from '@angular/animations';

export const fadeAnimation = trigger('fadeAnimation', [
    transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1 })),
    ]),
    transition(':leave', [
        animate('200ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 0 })),
    ]),
]);

export const slideUpAnimation = trigger('slideUpAnimation', [
    transition(':enter', [
        style({ transform: 'translateY(10px)', opacity: 0 }),
        animate('400ms cubic-bezier(0.4, 0, 0.2, 1)', style({ transform: 'translateY(0)', opacity: 1 })),
    ]),
]);

export const staggerList = trigger('staggerList', [
    transition('* => *', [
        query(':enter', [
            style({ transform: 'translateY(15px)', opacity: 0 }),
            stagger(50, [
                animate('400ms cubic-bezier(0.4, 0, 0.2, 1)', style({ transform: 'translateY(0)', opacity: 1 })),
            ]),
        ], { optional: true }),
    ]),
]);

export const cartPop = trigger('cartPop', [
    transition(':increment', [
        style({ transform: 'scale(1)' }),
        animate('150ms cubic-bezier(0.175, 0.885, 0.32, 1.275)', style({ transform: 'scale(1.2)' })),
        animate('100ms cubic-bezier(0.175, 0.885, 0.32, 1.275)', style({ transform: 'scale(1)' })),
    ]),
]);

export const shake = trigger('shake', [
    transition(':increment', [
        animate('100ms', style({ transform: 'translateX(-4px)' })),
        animate('100ms', style({ transform: 'translateX(4px)' })),
        animate('100ms', style({ transform: 'translateX(-4px)' })),
        animate('100ms', style({ transform: 'translateX(0)' })),
    ]),
]);
