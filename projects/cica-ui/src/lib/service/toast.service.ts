import { Service } from '@angular/core';

@Service()
export class ToastService {
  private readonly maxStack = 3;
  private readonly position = 'tr';
  private readonly container: HTMLDivElement | null = null;
  private readonly icons = {
    success:
      '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m8 12 3 3 5-6"/></svg>',
    error:
      '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/></svg>',
    warning:
      '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/></svg>',
    info: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>',
  };

  constructor() {
    this.container = document.querySelector(`.toast-container[data-position="${this.position}"]`);
    if (!this.container) {
      this.container = document.createElement<'div'>('div');
      this.container.className = 'toast-container';
      this.container.dataset['position'] = this.position;
      this.container.setAttribute('role', 'region');
      this.container.setAttribute('aria-label', 'Notifications');
      document.body.append(this.container);
    }
  }

  success(message: string, title = '', duration = 4000): void {
    this.show('success', message, title, duration);
  }

  error(message: string, title = '', duration = 4000): void {
    this.show('error', message, title, duration);
  }

  warning(message: string, title = '', duration = 4000): void {
    this.show('warning', message, title, duration);
  }

  info(message: string, title = '', duration = 4000): void {
    this.show('info', message, title, duration);
  }

  // duration in milliseconds; use 0 to keep the toast until it is closed
  show(
    type: 'success' | 'error' | 'warning' | 'info',
    message: string,
    title = '',
    duration = 4000,
  ) {
    const open = this.container!.querySelectorAll('.toast:not(.is-leaving)');
    if (open.length >= this.maxStack) this.dismiss(duration, open[0]);

    const t = document.createElement('div');
    t.className = `toast toast-${type}`;
    t.setAttribute('role', type === 'error' ? 'alert' : 'status');
    t.innerHTML = `<span class="toast-icon" aria-hidden="true">${this.icons[type]}</span>
      <div class="toast-body"><strong class="toast-title"></strong><p class="toast-message"></p></div>
      <button type="button" class="toast-close" aria-label="Dismiss notification">&times;</button>
      <span class="toast-progress"></span>`;
    // text goes in with textContent, so messages can never inject HTML
    t.querySelector('.toast-title')!.textContent = title;
    t.querySelector('.toast-message')!.textContent = message;
    t.querySelector('.toast-close')!.addEventListener('click', () => this.dismiss(duration, t));

    if (duration > 0) {
      t.style.setProperty('--toast-duration', duration + 'ms');
      t.querySelector('.toast-progress')!.addEventListener('animationend', () => this.dismiss(duration, t));
    } else {
      t.classList.add('is-sticky');
    }
    this.container!.append(t);
    return t;
  }

  dismiss(duration: number, t?: Element) {
    if (!t || t.classList.contains('is-leaving')) return;
    t.classList.add('is-leaving');
    const remove = () => t.remove();
    t.addEventListener('animationend', (e) => {
      if (e.target === t) remove();
    });
    setTimeout(remove, duration); // in case animations are switched off
  }
}
