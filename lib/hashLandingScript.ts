/**
 * Direct hash loads only (e.g. /#approach typed, linked or opened in a new tab).
 *
 * Firefox runs the native fragment jump before Inter swaps in; the swap then
 * reflows text above/around the target and the landing drifts (~20px).
 * Chromium keeps re-applying the fragment while layout settles; Firefox does not.
 *
 * Once the page has loaded and fonts are ready, re-apply the same native jump
 * with scrollIntoView(), so the target's scroll-margin stays the only offset.
 * Skipped when the user has interacted (wheel / pointer / touch / key) since
 * parse, when the hash has changed, and on reload / back-forward (the browser
 * restores the user's position there). Runs once per document; in-page nav
 * clicks are client-side and never reach this.
 *
 * Inline in <head> so the intent listeners exist before hydration.
 */
export const HASH_LANDING_SCRIPT = `(function () {
  var hash = location.hash;
  if (!hash || !document.fonts) return;
  var nav = performance.getEntriesByType && performance.getEntriesByType("navigation")[0];
  if (nav && nav.type !== "navigate") return;

  var cancelled = false;
  var intents = ["wheel", "pointerdown", "touchstart", "keydown"];
  var opts = { capture: true, passive: true };
  function cancel() { cancelled = true; }
  function cleanup() {
    intents.forEach(function (type) { removeEventListener(type, cancel, opts); });
  }
  intents.forEach(function (type) { addEventListener(type, cancel, opts); });

  function reapply() {
    document.fonts.ready.then(function () {
      requestAnimationFrame(function () {
        cleanup();
        if (cancelled || location.hash !== hash) return;
        var target = null;
        try { target = document.getElementById(decodeURIComponent(hash.slice(1))); } catch (e) {}
        if (target) target.scrollIntoView();
      });
    });
  }

  if (document.readyState === "complete") reapply();
  else addEventListener("load", reapply, { once: true });
})();`;
