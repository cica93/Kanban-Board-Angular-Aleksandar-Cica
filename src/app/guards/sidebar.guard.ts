import { CanDeactivateFn } from '@angular/router';

export const sidebarGuard: CanDeactivateFn<unknown> = (component, currentRoute, currentState, nextState) => {
  return !nextState.root.children.some((child) => child.outlet === 'sidebar');
};
