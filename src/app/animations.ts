import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

export const fadeInTrigger = trigger('fadeIn', [
  transition(':enter', [
    style({
      opacity: 0
    }),
    animate('1000ms')
  ]),
  transition(':leave', [
    animate(
      '3000ms 3000ms',
      style({
        opacity: 0
      })
    )
  ])
]);
