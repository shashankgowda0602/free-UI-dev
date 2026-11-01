import { DesignItem } from '../types';

export interface ShareResult {
  success: boolean;
  method: 'native' | 'clipboard';
  message: string;
}

export async function shareDesign(design: DesignItem): Promise<ShareResult> {
  const shareUrl = `${window.location.origin}/#design-${design.slug}`;
  const shareData = {
    title: `${design.name} — UIverse Studio`,
    text: `${design.shortDescription} — Discover & customize on UIverse Studio`,
    url: shareUrl,
  };

  if (navigator.share && typeof navigator.share === 'function') {
    try {
      await navigator.share(shareData);
      return {
        success: true,
        method: 'native',
        message: 'Shared successfully via native share.',
      };
    } catch (err: unknown) {
      if ((err as Error)?.name === 'AbortError') {
        return { success: false, method: 'native', message: 'Share canceled.' };
      }
      // Fallback to clipboard
    }
  }

  // Fallback to clipboard copy
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(shareUrl);
      return {
        success: true,
        method: 'clipboard',
        message: 'Shareable link copied to clipboard!',
      };
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = shareUrl;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      return {
        success: true,
        method: 'clipboard',
        message: 'Shareable link copied to clipboard!',
      };
    }
  } catch (err) {
    return {
      success: false,
      method: 'clipboard',
      message: 'Could not copy link to clipboard.',
    };
  }
}
