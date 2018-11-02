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
      animate(300, style({ opacity: 1 }))
    ]),
    transition(':leave', [
      animate(300, style({ opacity: 0 }))
    ]),
  ]);

export const slideAnimation =
  trigger('slide', [
      transition(':enter', [
      style({ opacity: 0, top: '60%' }),
      animate(500, style({ opacity: 1, top: '50%' }))
    ]),
    transition(':leave', [
      animate(500, style({ opacity: 0 }))
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