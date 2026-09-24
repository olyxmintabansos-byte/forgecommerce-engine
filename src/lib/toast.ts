export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title?: string;
  message: string;
  duration?: number;
}

export const toast = {
  dispatch(type: ToastMessage['type'], message: string, title?: string, duration: number = 3000) {
    if (typeof window === 'undefined') return;
    const detail: ToastMessage = {
      id: `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type,
      message,
      title,
      duration,
    };
    window.dispatchEvent(new CustomEvent('forge_toast_event', { detail }));
  },

  success(message: string, title?: string, duration?: number) {
    this.dispatch('success', message, title, duration);
  },

  info(message: string, title?: string, duration?: number) {
    this.dispatch('info', message, title, duration);
  },

  warning(message: string, title?: string, duration?: number) {
    this.dispatch('warning', message, title, duration);
  },

  error(message: string, title?: string, duration?: number) {
    this.dispatch('error', message, title, duration);
  },
};
