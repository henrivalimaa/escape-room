import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

export const fadeAnimation =
  trigger('fade', [
      transition(':enter', [
      style({ opacity: 0 }),
      animate(1000, style({ opacity: 1 }))
    ]),
    transition(':leave', [
      animate(1000, style({ opacity: 0 }))
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