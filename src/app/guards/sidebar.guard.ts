import { CanDeactivateFn } from '@angular/router';

export const sidebarGuard: CanDeactivateFn<unknown> = (
  _component,
  _currentRoute,
  _currentState,
  nextState,
) => {
  return !nextState.root.children.some((child) => child.outlet === 'sidebar');
};
