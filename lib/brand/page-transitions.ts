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
  const quiet = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const slug = url => { try { return new URL(url).pathname.match(/\\/software\\/([^/]+)\\/?$/)?.[1]; } catch { return null; } };
  const setPublication = (id, transition) => {
    if (!id || !/^[a-z0-9-]+$/.test(id) || !('adoptedStyleSheets' in document)) return false;
    const element = Array.from(document.querySelectorAll('[data-publication]')).find(el => el.dataset.publication === id);
    if (!element) return false;
    const box = element.getBoundingClientRect();
    if (!box.width || !box.height || box.bottom < 0 || box.top > innerHeight) return false;
    const sheet = new CSSStyleSheet();
    sheet.replaceSync('[data-publication="' + id + '"] { view-transition-name: harulo-publication; }');
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
    root.dataset.publicationTransition = 'true';
    transition.finished.finally(() => { document.adoptedStyleSheets = document.adoptedStyleSheets.filter(item => item !== sheet); delete root.dataset.publicationTransition; }).catch(() => {});
    return true;
  };
  window.addEventListener('pageswap', event => {
    resetPending();
    if (!event.viewTransition) return;
    const destination = event.activation?.entry?.url;
    const product = destination && location.pathname === '/software' ? slug(destination) : null;
    if (quiet() || !product) { event.viewTransition.skipTransition(); return; }
    if (!setPublication(product, event.viewTransition)) event.viewTransition.skipTransition();
  });
  window.addEventListener('pagereveal', event => {
    if (!event.viewTransition) return;
    const source = window.navigation?.activation?.from?.url || document.referrer;
    const product = source && new URL(source).pathname === '/software' ? slug(location.href) : null;
    if (quiet() || !product) { event.viewTransition.skipTransition(); return; }
    if (!setPublication(product, event.viewTransition)) event.viewTransition.skipTransition();
  });
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.site-header nav a').forEach(a => {
      if (location.pathname === a.pathname || location.pathname.startsWith(a.pathname + '/')) a.setAttribute('aria-current', 'page');
    });
  });
})();`;
