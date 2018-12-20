import {
  trigger,
  state,
  style,
  animate,
  query,
  transition
} from '@angular/animations';

export const fadeAnimation =
  trigger('fade', [
      transition(':enter', [
      style({ opacity: 0 }),
      animate(200, style({ opacity: 1 }))
    ]),
    transition(':leave', [
      animate(200, style({ opacity: 0 }))
    ]),
  ]);

export const textAnimation =
  trigger('textFade', [
      transition(':enter', [
      style({ opacity: 0, 'font-size': '1em' }),
      animate(300, style({ opacity: 1, 'font-size': '2em' }))
    ]),
    transition(':leave', [
      animate(300, style({ opacity: 0, 'font-size': '20em' }))
    ]),
  ]);

export const slideAnimation =
  trigger('slide', [
      transition(':enter', [
      style({ opacity: 0, bottom: '-4em' }),
      animate(300, style({ opacity: 1, bottom: '1em' }))
    ]),
    transition(':leave', [
      animate(500, style({ opacity: 1, bottom: '-4em' }))
    ]),
  ]);

export const darkenAnimation =
  trigger('darken', [
      transition(':enter', [
      style({ opacity: 0 }),
      animate(200, style({ opacity: 1 }))
    ]),
    transition(':leave', [
      animate(200, style({ opacity: 0 }))
    ]),
  ]);

export const viewFadeAnimation = trigger('viewFade', [
  transition('* => *', [
    query(
      ':enter',
      [style({ opacity: 0 })],
      { optional: true }
    ),
    query(
      ':leave',
      [style({ opacity: 1 }), animate('0.3s', style({ opacity: 0 }))],
      { optional: true }
    ),
    query(
      ':enter',
      [style({ opacity: 0 }), animate('0.3s', style({ opacity: 1 }))],
      { optional: true }
    )
  ])
]);