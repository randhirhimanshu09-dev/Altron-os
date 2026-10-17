// Service managing the persistent Android Notification Shade shortcut

class NotificationShortcutService {
  private swRegistration: ServiceWorkerRegistration | null = null;
  private isSupported: boolean = false;

  constructor() {
    this.isSupported = typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator;
    if (this.isSupported) {
      this.initServiceWorker();
    }
  }

  private async initServiceWorker() {
    try {
      this.swRegistration = await navigator.serviceWorker.register('/sw.js');
    } catch (err) {
      console.warn('Service worker registration failed:', err);
    }
  }

  public async requestAndShowShortcut(): Promise<{ success: boolean; message: string }> {
    if (!this.isSupported) {
      return {
        success: false,
        message: 'Web Notification API is not supported in this browser.',
      };
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        return {
          success: false,
          message: 'Notification permission was denied. Tap the lock icon in your browser to allow notifications.',
        };
      }

      if (this.swRegistration) {
        // Use service worker to post persistent notification with quick actions
        await this.swRegistration.showNotification('ALTRON OS Quick Launch', {
          body: 'Tap to open Central Voice Assistant, Calling & Controls',
          icon: '/icon-192.png',
          badge: '/icon-192.png',
          tag: 'altron-persistent-shade',
          silent: true,
          requireInteraction: true,
          data: { url: '/' },
        });
      } else {
        new Notification('ALTRON OS Quick Launch', {
          body: 'Tap to open Central Voice Assistant, Calling & Controls',
          icon: '/icon-192.png',
          tag: 'altron-persistent-shade',
          requireInteraction: true,
        });
      }

      return {
        success: true,
        message: 'ALTRON Quick Launch Shortcut added to Android notification shade!',
      };
    } catch (err: any) {
      console.warn('Failed to post notification shortcut:', err);
      return {
        success: false,
        message: 'Could not create notification shortcut: ' + (err.message || 'Permission required'),
      };
    }
  }

  public isPermissionGranted(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted';
  }
}

export const notificationShortcut = new NotificationShortcutService();
