/**
 * Per-route <title>, description, canonical and Open Graph tags.
 *
 * Dependency-free — no react-helmet needed. Drop this file in, then call
 * useSeo() once from your route-level components (see usage note at the end).
 *
 * Why this is needed: the site is a client-rendered SPA, so every route
 * currently serves the same static <head>. Today "/", "/about" and "/privacy"
 * all report the title "Health Check Holidays" with no description and no
 * canonical, which is what search results and link previews will show.
 */

import { useEffect } from "react";

const SITE = "https://go-hch.com";
const SITE_NAME = "Health Check Holidays";
const DEFAULT_IMAGE = `${SITE}/og-image.png`;

/**
 * The corporate site and the demo are served from separate Amplify branches
 * under different hostnames, but share this module. On any host that isn't
 * the canonical one, it must not emit a canonical URL pointing at go-hch.com:
 * the demo branch already sends `X-Robots-Tag: noindex` at the edge for its
 * host, and noindex + canonical are conflicting signals. Emit noindex only,
 * and no canonical.
 */
const CANONICAL_HOST = "go-hch.com";

function isCanonicalHost() {
  if (typeof window === "undefined") return true;
  return window.location.hostname === CANONICAL_HOST;
}

/**
 * Route metadata.
 *
 * `noindex: true` keeps a route out of search results. It is set on the
 * unfinished product routes so that, now the site is publicly crawlable,
 * half-built screens don't end up in the index. Remove the flag from a route
 * when that screen is genuinely ready to be found.
 */
export const ROUTE_META = {
  "/": {
    title: "Health Check Holidays — World-class health checks, unforgettable travel",
    description:
      "Health Check Holidays pairs JCI-accredited hospital screenings across Asia with a family holiday, at around half the cost of equivalent private screening in the US. In development — not yet open for bookings.",
  },
  "/about": {
    title: "About — Health Check Holidays",
    description:
      "Preventive care in the US is priced like a luxury. We pair the same hospital-grade screenings with a trip to Asia, so your family leaves with results and a holiday.",
  },
  "/privacy": {
    title: "Privacy — Health Check Holidays",
    description:
      "What is and isn't collected across go-hch.com and the demo. We're pre-launch: no analytics, no tracking scripts, and nothing from the demo is stored.",
  },
  "/terms": {
    title: "Terms of Use — Health Check Holidays",
    description:
      "Terms of use for go-hch.com and demo.go-hch.com, including that the company is pre-launch and the demo is not a real booking service.",
  },

  // --- Unfinished product surfaces: reachable, but kept out of the index. ---
  "/destinations": { title: "Destinations — Health Check Holidays", noindex: true },
  "/how-it-works": { title: "How it works — Health Check Holidays", noindex: true },
  "/shop": { title: "Packages — Health Check Holidays", noindex: true },
  "/search": { title: "Search — Health Check Holidays", noindex: true },
  "/test-selector": { title: "Test selector — Health Check Holidays", noindex: true },
  "/book": { title: "Book — Health Check Holidays", noindex: true },
  "/account": { title: "Account — Health Check Holidays", noindex: true },
  "/profile": { title: "Profile — Health Check Holidays", noindex: true },
};

const FALLBACK = {
  title: `${SITE_NAME} — page not found`,
  description: "That page doesn't exist. Head back to go-hch.com.",
  noindex: true,
};

/** Create or update <meta>/<link> without duplicating tags across navigations. */
function setTag(selector, create, attr, value) {
  let el = document.head.querySelector(selector);
  if (value == null) {
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

function meta(name, content) {
  setTag(
    `meta[name="${name}"]`,
    () => Object.assign(document.createElement("meta"), { name }),
    "content",
    content
  );
}

function og(property, content) {
  setTag(
    `meta[property="${property}"]`,
    () => {
      const el = document.createElement("meta");
      el.setAttribute("property", property);
      return el;
    },
    "content",
    content
  );
}

/**
 * Apply metadata for the current route.
 *
 * @param {string} pathname  Usually `useLocation().pathname`.
 * @param {object} [override] Per-render overrides, e.g. a package name on /shop/:id.
 */
export function applySeo(pathname, override = {}) {
  const base = ROUTE_META[pathname] || FALLBACK;
  const m = { ...base, ...override };

  const onCanonicalHost = isCanonicalHost();
  const canonical = `${SITE}${pathname === "/" ? "/" : pathname.replace(/\/+$/, "")}`;
  const image = m.image || DEFAULT_IMAGE;
  const description = m.description || ROUTE_META["/"].description;

  document.title = m.title;
  meta("description", description);

  // Canonical only on the canonical host. On the demo (or any preview host)
  // the page is noindex, and pairing noindex with a canonical pointing
  // elsewhere sends search engines two contradictory instructions.
  setTag(
    'link[rel="canonical"]',
    () => Object.assign(document.createElement("link"), { rel: "canonical" }),
    "href",
    onCanonicalHost ? canonical : null
  );

  // Suppress the page when the route is unfinished, or whenever we're on a
  // non-canonical host. The demo branch already sends X-Robots-Tag for its
  // host; this is the belt to its braces, and covers anyone previewing a
  // local build.
  meta(
    "robots",
    m.noindex || !onCanonicalHost ? "noindex, nofollow" : null
  );

  og("og:type", "website");
  og("og:site_name", SITE_NAME);
  og("og:locale", "en_GB");
  og("og:url", canonical);
  og("og:title", m.title);
  og("og:description", description);
  og("og:image", image);
  og("og:image:width", "1200");
  og("og:image:height", "630");

  meta("twitter:card", "summary_large_image");
  meta("twitter:title", m.title);
  meta("twitter:description", description);
  meta("twitter:image", image);
}

/** React hook form. Call once per route component. */
export function useSeo(pathname, override) {
  useEffect(() => {
    applySeo(pathname, override);
  }, [pathname, JSON.stringify(override || {})]);
}
