/** Parser-time enhancement for native links. No interception, fetching, or navigation delays.
 * https://developer.chrome.com/docs/web-platform/view-transitions/cross-document
 */
export const pageTransitionScript = `(() => {
  const root = document.documentElement;
  let pendingTimer;
  const resetPending = () => { clearTimeout(pendingTimer); delete root.dataset.navigationPending; };
  document.addEventListener('click', event => {
    const link = event.target.closest?.('a[href]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || (url.pathname === location.pathname && url.search === location.search) || root.dataset.enhanced !== 'true') return;
    resetPending();
    pendingTimer = setTimeout(() => { root.dataset.navigationPending = 'true'; }, 180);
  });
  window.addEventListener('pageshow', resetPending);
  window.addEventListener('pagehide', resetPending);
  window.navigation?.addEventListener('navigateerror', resetPending);
  const quiet = () => matchMedia('(prefers-reduced-motion: reduce)').matches || root.dataset.motion === 'paused';
  const slug = url => { try { return new URL(url).pathname.match(/\\/software\\/([^/]+)\\/?$/)?.[1]; } catch { return null; } };
  const setPublication = (id, transition) => {
    if (!id) return;
    const element = Array.from(document.querySelectorAll('[data-publication]')).find(el => el.dataset.publication === id);
    if (!element) return;
    const disclosure = element.closest('details');
    if (disclosure) disclosure.open = true;
    const box = element.getBoundingClientRect();
    if (!box.width || !box.height || box.bottom < 0 || box.top > innerHeight) return;
    element.style.viewTransitionName = 'harulo-publication';
    root.dataset.publicationTransition = 'true';
    transition.finished.finally(() => { element.style.viewTransitionName = ''; delete root.dataset.publicationTransition; }).catch(() => {});
  };
  window.addEventListener('pageswap', event => {
    resetPending();
    if (!event.viewTransition) return;
    if (quiet()) { event.viewTransition.skipTransition(); return; }
    setPublication(slug(event.activation?.entry?.url) || slug(location.href), event.viewTransition);
  });
  window.addEventListener('pagereveal', event => {
    if (!event.viewTransition) return;
    if (quiet()) { event.viewTransition.skipTransition(); return; }
    setPublication(slug(location.href) || slug(window.navigation?.activation?.from?.url) || slug(document.referrer), event.viewTransition);
  });
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.site-header nav a').forEach(a => {
      if (location.pathname === a.pathname || location.pathname.startsWith(a.pathname + '/')) a.setAttribute('aria-current', 'page');
    });
  });
})();`;
