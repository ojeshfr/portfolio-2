"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { site } from "@/lib/site";

const links = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const reduceMotion = usePrefersReducedMotion();

  // Handle scroll detection for glass depth enhancement
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle Escape key to close mobile menu & restore focus
  useEffect(() => {
    if (!menuOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        triggerRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  // While the mobile menu is open: lock scrolling (incl. Lenis), make the page behind it inert,
  // and move focus into the panel so keyboard and screen-reader users stay inside it.
  useEffect(() => {
    if (!menuOpen) return;
    const behind = document.querySelectorAll<HTMLElement>("#main-content, .site-footer");
    behind.forEach((element) => { element.inert = true; });
    document.body.style.overflow = "hidden";
    document.body.dataset.menuOpen = "true";
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();
    return () => {
      behind.forEach((element) => { element.inert = false; });
      document.body.style.removeProperty("overflow");
      delete document.body.dataset.menuOpen;
    };
  }, [menuOpen]);

  return (
    <header className={`site-header${scrolled ? " site-header--scrolled" : ""}`}>
      <div className="site-header__inner">
        <Link className="site-wordmark" href="/" aria-label="Ojesh — home" onClick={() => setMenuOpen(false)}>
          Ojesh
        </Link>

        <nav className="site-nav" aria-label="Main navigation">
          {links.map((link) => (
            <Link
              aria-current={isActive(pathname, link.href) ? "page" : undefined}
              className={isActive(pathname, link.href) ? "is-current" : undefined}
              href={link.href}
              key={link.href}
            >
              {link.label}
            </Link>
          ))}
          <a href={site.githubUrl} rel="noreferrer" target="_blank" aria-label="GitHub profile (opens in new tab)">
            GitHub <span aria-hidden="true" className="chevron">›</span>
          </a>
        </nav>

        <button
          aria-controls="mobile-navigation"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          className="site-menu-toggle"
          onClick={() => setMenuOpen((open) => !open)}
          ref={triggerRef}
          type="button"
        >
          <span />
          <span />
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            aria-label="Mobile navigation"
            animate={{ opacity: 1, y: 0 }}
            className="mobile-nav-panel"
            exit={{ opacity: 0, y: -8 }}
            id="mobile-navigation"
            ref={panelRef}
            initial={reduceMotion ? false : { opacity: 0, y: -12 }}
            role="dialog"
            aria-modal="true"
            transition={{ duration: reduceMotion ? 0 : 0.28, ease: [0.28, 0.11, 0.32, 1] }}
          >
            <nav className="mobile-nav-links">
              <Link
                aria-current={pathname === "/" ? "page" : undefined}
                href="/"
                onClick={() => setMenuOpen(false)}
              >
                <span>Home</span>
                <span aria-hidden="true" className="chevron">›</span>
              </Link>
              {links.map((link) => (
                <Link
                  aria-current={isActive(pathname, link.href) ? "page" : undefined}
                  href={link.href}
                  key={link.href}
                  onClick={() => setMenuOpen(false)}
                >
                  <span>{link.label}</span>
                  <span aria-hidden="true" className="chevron">›</span>
                </Link>
              ))}
              <a
                href={site.githubUrl}
                onClick={() => setMenuOpen(false)}
                rel="noreferrer"
                target="_blank"
              >
                <span>GitHub</span>
                <span aria-hidden="true" className="chevron">›</span>
              </a>
            </nav>

            <div className="mobile-nav-footer">
              <p>Ojesh · Creative Developer &amp; Product Engineer</p>
              <p>India · C# &amp; TypeScript</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
