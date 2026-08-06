import { expect, test as base } from '@playwright/test';

export const test = base.extend({
  page: async ({ page }, use) => {
    const installClickHighlighter = () => {
      const win = window as typeof window & {
        __playwrightClickHighlighterInstalled?: boolean;
      };

      if (win.__playwrightClickHighlighterInstalled) {
        return;
      }

      win.__playwrightClickHighlighterInstalled = true;

      const overlay = document.createElement('div');
      overlay.setAttribute('data-testid', 'playwright-click-highlight');
      Object.assign(overlay.style, {
        position: 'fixed',
        pointerEvents: 'none',
        zIndex: '2147483647',
        border: '4px solid red',
        borderRadius: '4px',
        boxShadow: '0 0 0 2px white, 0 0 18px rgba(255, 0, 0, 0.75)',
        display: 'none',
        transition: 'opacity 120ms ease',
      });
      document.documentElement.appendChild(overlay);

      let hideTimer: number | undefined;

      const showAround = (target: EventTarget | null) => {
        if (!(target instanceof Element)) {
          return;
        }

        const rect = target.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) {
          return;
        }

        const padding = 4;
        overlay.style.left = `${Math.max(rect.left - padding, 0)}px`;
        overlay.style.top = `${Math.max(rect.top - padding, 0)}px`;
        overlay.style.width = `${rect.width + padding * 2}px`;
        overlay.style.height = `${rect.height + padding * 2}px`;
        overlay.style.opacity = '1';
        overlay.style.display = 'block';

        window.clearTimeout(hideTimer);
        hideTimer = window.setTimeout(() => {
          overlay.style.opacity = '0';
          window.setTimeout(() => {
            overlay.style.display = 'none';
          }, 140);
        }, 650);
      };

      ['pointerdown', 'click', 'change', 'focus'].forEach((eventName) => {
        document.addEventListener(
          eventName,
          (event) => showAround(event.target),
          true,
        );
      });
    };

    await page.addInitScript(installClickHighlighter);
    await page.evaluate(installClickHighlighter);
    await use(page);
  },
});

export { expect };
