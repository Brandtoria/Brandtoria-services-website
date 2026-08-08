import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'

const app = new Hono()

// Serve static files
app.use('/static/*', serveStatic({ root: './public' }))
app.use('/images/*', serveStatic({ root: './public' }))

app.get('/', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>BRANDTORIA</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="https://use.typekit.net/zds8qhj.css" />
  <style>
    /* ─── RESET ─────────────────────────────────────── */
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; overflow: hidden; }
    html.site-ready, body.site-ready { overflow-y: auto; height: auto; }

    /* ─── AGAINST FONT (self-hosted) ──────────────────── */
    @font-face {
      font-family: 'Against';
      src: url('/static/against.otf') format('opentype');
      font-weight: normal;
      font-style: normal;
      font-display: block;
    }

    /* ─── LOADER ────────────────────────────────────── */
    #loader {
      position: fixed;
      inset: 0;
      background: #000;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    }

    /* Brand name */
    .loader-brand {
      font-family: 'Against', serif;
      font-size: clamp(40px, 6.5vw, 88px);
      font-weight: normal;
      letter-spacing: 0.04em;
      color: #fff;
      line-height: 1;
      display: flex;
      align-items: baseline;
      gap: 0;
      overflow: hidden;
    }

    .brand-accent { color: #E8321A; }
    .nav-logo .brand-accent { color: #E8321A; }

    /* Each character slides up */
    .loader-brand .char {
      display: inline-block;
      opacity: 0;
      transform: translateY(40px);
      animation: charReveal 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    }

    @keyframes charReveal {
      to { opacity: 1; transform: translateY(0); }
    }

    /* ─── TAGLINE  //  word  // ─────────────────────── */
    .loader-tagline {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-top: 22px;
      opacity: 0;
      animation: fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) 1.4s forwards;
    }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .tagline-slash {
      font-family: 'DM Sans', sans-serif;
      font-size: clamp(16px, 2vw, 24px);
      font-weight: 300;
      color: #E8321A;
      letter-spacing: 0.04em;
      line-height: 1;
    }

    /* Fixed-width container so the word swap doesn't shift the slashes */
    .word-container {
      font-family: 'DM Sans', sans-serif;
      font-size: clamp(16px, 2vw, 24px);
      font-weight: 300;
      letter-spacing: 0.18em;
      color: #fff;
      width: 200px;          /* wide enough for "Construcción" */
      text-align: center;
      position: relative;
      height: 1.4em;
      overflow: hidden;
    }

    .word-item {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transform: translateY(100%);
      transition: opacity 0.18s ease, transform 0.18s cubic-bezier(0.22, 1, 0.36, 1);
      white-space: nowrap;
    }

    .word-item.active {
      opacity: 1;
      transform: translateY(0);
    }

    .word-item.exit {
      opacity: 0;
      transform: translateY(-110%);
      transition: opacity 0.15s ease, transform 0.15s ease;
    }

    /* ─── LOADER EXIT ──────────────────────────────── */
    #loader.hide {
      animation: loaderOut 0.9s cubic-bezier(0.76, 0, 0.24, 1) forwards;
    }

    @keyframes loaderOut {
      0%   { opacity: 1; transform: translateY(0); }
      100% { opacity: 0; transform: translateY(-3%); pointer-events: none; }
    }

    /* ─── MAIN SITE ─────────────────────────────────── */
    #site {
      width: 100%;
      height: 100%;
      opacity: 0;
      transition: opacity 0.7s ease 0.15s;
    }

    #site.visible { opacity: 1; }

    /* ─── HERO ──────────────────────────────────────── */
    #hero {
      position: relative;
      width: 100%;
      height: 100vh;
      overflow: hidden;
      background: #0d0d0d;
    }

    .hero-image {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
    }

    .hero-overlay {
      position: absolute;
      inset: 0;
      background:
        linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 30%),
        linear-gradient(to top,    rgba(0,0,0,0.18) 0%, transparent 35%);
      pointer-events: none;
    }

    /* ─── TOP BAR ───────────────────────────────────── */
    .top-bar {
      position: absolute;
      top: 0; left: 0; right: 0;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: clamp(20px, 3vw, 42px) clamp(24px, 4.5vw, 64px);
      z-index: 100;
    }

    .nav-logo {
      font-family: 'Against', serif;
      font-size: clamp(18px, 2.2vw, 30px);
      font-weight: normal;
      color: #1a1a1a;
      letter-spacing: 0.04em;
      text-decoration: none;
      display: flex;
      align-items: baseline;
      opacity: 0;
      animation: slideDown 0.6s ease 0.3s forwards;
    }

    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-10px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* ─── HAMBURGER ─────────────────────────────────── */
    .hamburger {
      width: 48px;
      height: 48px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      justify-content: center;
      gap: 7px;
      background: none;
      border: none;
      padding: 10px;
      z-index: 200;
      opacity: 0;
      animation: fadeIn 0.6s ease 0.5s forwards;
    }

    @keyframes fadeIn { to { opacity: 1; } }

    .hamburger span {
      display: block;
      height: 1.5px;
      background: #1a1a1a;
      border-radius: 1px;
      transition:
        width 0.35s cubic-bezier(0.76, 0, 0.24, 1),
        transform 0.4s cubic-bezier(0.76, 0, 0.24, 1),
        opacity 0.3s ease;
      transform-origin: right center;
    }

    /* Resting state — lines slightly skewed / different widths */
    .hamburger span:nth-child(1) { width: 18px; transform: rotate(-7deg); }
    .hamburger span:nth-child(2) { width: 28px; transform: rotate(-3deg); }
    .hamburger span:nth-child(3) { width: 22px; transform: rotate(-5deg); }

    /* Hover — all straighten and equalize */
    .hamburger:hover span:nth-child(1),
    .hamburger:hover span:nth-child(2),
    .hamburger:hover span:nth-child(3) {
      width: 28px;
      transform: rotate(0deg);
    }

    /* Open (X) state */
    .hamburger.open span:nth-child(1) {
      width: 28px;
      transform: translateY(8.5px) rotate(45deg);
    }
    .hamburger.open span:nth-child(2) {
      width: 28px;
      opacity: 0;
      transform: scaleX(0);
    }
    .hamburger.open span:nth-child(3) {
      width: 28px;
      transform: translateY(-8.5px) rotate(-45deg);
    }

    /* ─── HERO BRAND ────────────────────────────────── */
    .hero-brand {
      position: absolute;
      top: clamp(60px, 9vh, 110px);
      left: clamp(24px, 4.5vw, 64px);
      z-index: 10;
      opacity: 0;
      animation: fadeUp2 0.7s ease 0.5s forwards;
    }

    @keyframes fadeUp2 {
      from { opacity: 0; transform: translateY(12px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .hero-brand-name {
      font-family: 'Against', serif;
      font-size: clamp(26px, 3.5vw, 50px);
      font-weight: normal;
      letter-spacing: 0.04em;
      line-height: 1;
      display: flex;
      align-items: baseline;
    }

    .hero-subtitle {
      font-family: 'DM Sans', sans-serif;
      font-size: clamp(10px, 1.1vw, 15px);
      font-weight: 400;
      color: #1a1a1a;
      letter-spacing: 0.12em;
      margin-top: 8px;
    }

    /* ─── DECO SLASHES TOP RIGHT ─────────────────────── */
    .deco-slash {
      position: absolute;
      top: clamp(24px, 3.5vw, 50px);
      right: clamp(90px, 9vw, 150px);
      display: flex;
      flex-direction: column;
      gap: 5px;
      opacity: 0;
      animation: fadeIn 0.8s ease 0.9s forwards;
    }

    .deco-slash span {
      display: block;
      height: 2px;
      background: #E8321A;
      border-radius: 2px;
    }
    .deco-slash span:nth-child(1) { width: 26px; transform: rotate(-12deg); }
    .deco-slash span:nth-child(2) { width: 22px; transform: rotate(-12deg); }

    /* ─── SCROLL INDICATOR ───────────────────────────── */
    .scroll-indicator {
      position: absolute;
      bottom: clamp(28px, 5vh, 56px);
      left: clamp(24px, 4.5vw, 64px);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      opacity: 0;
      animation: fadeIn 0.8s ease 1.2s forwards;
    }

    .scroll-text {
      font-family: 'DM Sans', sans-serif;
      font-size: 10px;
      letter-spacing: 0.28em;
      color: #E8321A;
      writing-mode: vertical-rl;
      transform: rotate(180deg);
    }

    .scroll-arrows { display: flex; flex-direction: column; gap: 3px; margin-top: 2px; }

    .scroll-arrows span {
      display: block;
      width: 9px;
      height: 9px;
      border-right: 1.5px solid #E8321A;
      border-bottom: 1.5px solid #E8321A;
      transform: rotate(45deg);
      animation: pulse 1.5s infinite;
    }
    .scroll-arrows span:nth-child(2) { animation-delay: 0.2s; }
    .scroll-arrows span:nth-child(3) { animation-delay: 0.4s; }

    @keyframes pulse {
      0%, 100% { opacity: 0.2; }
      50%       { opacity: 1; }
    }

    /* ─── NAV OVERLAY ────────────────────────────────── */
    #nav-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.97);
      z-index: 150;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 36px;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.5s cubic-bezier(0.76, 0, 0.24, 1);
    }

    #nav-overlay.open {
      opacity: 1;
      pointer-events: all;
    }

    .nav-item {
      font-family: 'Against', serif;
      font-size: clamp(30px, 5vw, 62px);
      font-weight: normal;
      color: #fff;
      letter-spacing: 0.05em;
      text-decoration: none;
      opacity: 0;
      transform: translateY(20px);
      transition: color 0.3s ease, opacity 0.4s ease, transform 0.4s ease;
    }

    #nav-overlay.open .nav-item { opacity: 1; transform: translateY(0); }
    #nav-overlay.open .nav-item:nth-child(1) { transition-delay: 0.08s; }
    #nav-overlay.open .nav-item:nth-child(2) { transition-delay: 0.15s; }
    #nav-overlay.open .nav-item:nth-child(3) { transition-delay: 0.22s; }
    #nav-overlay.open .nav-item:nth-child(4) { transition-delay: 0.29s; }
    .nav-item:hover { color: #E8321A; }

    /* ═══════════════════════════════════════════════
       SECTION 2 — NOS ESFORZAMOS POR INNOVAR
    ═══════════════════════════════════════════════ */
    #section-innovar {
      background: #fff;
      /* Toda la sección cabe en 100vh */
      height: 100vh;
      padding: clamp(32px, 4vh, 56px) clamp(24px, 5vw, 80px);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-sizing: border-box;
    }

    /* ── Header ──
       ROW 1: [// título]  [vacío]  [CTA botón]
       ROW 2: [párrafo extendido col 1+2]  [vacío col 3]
    ── */
    .s2-header {
      display: grid;
      grid-template-columns: auto 1fr auto;
      grid-template-rows: auto auto;
      column-gap: 40px;
      row-gap: clamp(8px, 1.2vh, 16px);
      align-items: center;
      margin-bottom: clamp(16px, 2.5vh, 32px);
      flex-shrink: 0;
    }

    /* Fila 1, col 1: slashes + título */
    .s2-header-title-block {
      grid-column: 1;
      grid-row: 1;
      display: flex;
      align-items: center;
      gap: 12px;
      white-space: nowrap;
    }

    .s2-eyebrow-slashes {
      display: flex;
      flex-direction: column;
      gap: 4px;
      flex-shrink: 0;
    }
    .s2-eyebrow-slashes span {
      display: block;
      height: 2.5px;
      background: #E8321A;
      border-radius: 2px;
    }
    .s2-eyebrow-slashes span:nth-child(1) { width: 24px; }
    .s2-eyebrow-slashes span:nth-child(2) { width: 18px; }

    .s2-title {
      font-family: 'DM Sans', sans-serif;
      font-size: clamp(20px, 2.6vw, 38px);
      font-weight: 700;
      color: #1a1a1a;
      line-height: 1.1;
      letter-spacing: -0.01em;
      white-space: nowrap;
    }
    .s2-title span { color: #E8321A; }

    /* Fila 1, col 3: botón CTA */
    .s2-cta {
      grid-column: 3;
      grid-row: 1;
      display: inline-flex;
      align-items: center;
      gap: 12px;
      border: 1.5px solid #E8321A;
      border-radius: 100px;
      padding: 12px 16px 12px 24px;
      font-family: 'DM Sans', sans-serif;
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 0.11em;
      text-transform: uppercase;
      color: #E8321A;
      text-decoration: none;
      white-space: nowrap;
      align-self: center;
      transition: background 0.3s ease, color 0.3s ease;
    }
    .s2-cta:hover { background: #E8321A; color: #fff; }
    .s2-cta:hover .s2-cta-icon { background: #fff; }
    .s2-cta:hover .s2-cta-icon svg path { stroke: #E8321A; }
    .s2-cta-icon {
      width: 26px; height: 26px;
      background: #E8321A;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      transition: background 0.3s ease;
      flex-shrink: 0;
    }

    /* Fila 2, col 1+2: párrafo alineado a la izquierda, ~3 líneas */
    .s2-body-text {
      grid-column: 1 / 3;
      grid-row: 2;
      font-family: 'DM Sans', sans-serif;
      font-size: clamp(13px, 1.15vw, 15px);
      font-weight: 300;
      color: #444;
      line-height: 1.75;
    }
    .s2-body-text em { font-style: italic; color: #E8321A; font-weight: 400; }

    /* ── Grid ──
       Col 1: logos(r1) + quote(r2)
       Col 2: photo card spans rows 1+2
       Col 3: card-text-right(r1) + card-contact(r2)
    ── */
    .s2-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      /* Proporción exacta de referencia: 121:623 */
      grid-template-rows: 121fr 623fr;
      gap: 14px;
      perspective: 1400px;
      /* Ocupa todo el espacio vertical restante en la sección */
      flex: 1;
      min-height: 0;
    }

    /* Hinge base */
    .s2-card {
      border-radius: 14px;
      overflow: hidden;
      transform-origin: top center;
      transform: rotateX(-88deg);
      opacity: 0;
      transition:
        transform 0.75s cubic-bezier(0.34, 1.4, 0.64, 1),
        opacity 0.45s ease;
      will-change: transform, opacity;
    }
    .s2-card.hinge-in { transform: rotateX(0deg); opacity: 1; }
    .s2-card:nth-child(1) { transition-delay: 0s;    }
    .s2-card:nth-child(2) { transition-delay: 0.07s; }
    .s2-card:nth-child(3) { transition-delay: 0.14s; }
    .s2-card:nth-child(4) { transition-delay: 0.05s; }
    .s2-card:nth-child(5) { transition-delay: 0.12s; }

    /* ── Card: Logos (row 1, col 1) ── */
    .card-logos {
      grid-column: 1;
      grid-row: 1;
      background: #fff;
      border: 1px solid #e4e4e4;
      padding: 18px 24px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .card-logos img {
      height: 44px;
      width: 44px;
      object-fit: contain;
      border-radius: 50%;
      border: 1px solid #e4e4e4;
      flex-shrink: 0;
    }
    .card-logos-more {
      font-family: 'DM Sans', sans-serif;
      font-size: 12px;
      font-weight: 400;
      color: #888;
      white-space: nowrap;
      margin-left: 4px;
    }

    /* ── Card: Photo (col 2, rows 1+2) ── */
    .card-photo {
      grid-column: 2;
      grid-row: 1 / 3;
      background: #111;
      border-radius: 14px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .card-photo-img {
      flex: 1;
      overflow: hidden;
      min-height: 0;
    }
    .card-photo-img img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center center;
      display: block;
    }
    .card-photo-footer {
      background: #E8321A;
      /* Footer height: 141/(602+141) = ~19% of card height */
      flex: 0 0 18.96%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .card-photo-brand {
      font-family: 'Against', serif;
      font-size: clamp(20px, 2.2vw, 32px);
      color: #fff;
      letter-spacing: 0.04em;
    }
    .card-photo-brand .dot { color: #0b0be6; }

    /* ── Card: Quote / dynamic word (row 2, col 1) ── */
    .card-quote {
      grid-column: 1;
      grid-row: 2;
      background: #fff;
      border: 1px solid #e4e4e4;
      padding: clamp(22px, 2.8vw, 38px);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .card-quote-mark {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: clamp(80px, 10vw, 140px);
      font-weight: 700;
      color: #1a1a1a;
      line-height: 0.6;
      text-align: center;
      display: block;
      margin-bottom: clamp(16px, 2.5vh, 32px);
    }
    .card-quote-text {
      font-family: 'DM Sans', sans-serif;
      font-size: clamp(25px, 2.2vw, 31px);
      font-weight: 400;
      color: #1a1a1a;
      line-height: 1.35;
    }

    /* Dynamic word */
    .dyn-word-wrap {
      display: inline-block;
      position: relative;
      overflow: hidden;
      vertical-align: middle;
      /* altura basada en el font-size de la palabra dinámica */
      height: clamp(28px, 3vw, 44px);
      min-width: 160px;
      transition: width 0.25s ease;
    }
    .dyn-word {
      font-family: 'reiher-headline', serif;
      font-style: italic;
      font-weight: 400;
      font-size: clamp(20px, 2.2vw, 32px);
      background: linear-gradient(90deg, #0404bf 0%, #ff4808 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      position: absolute;
      left: 0; top: 0;
      opacity: 0;
      transform: translateY(100%);
      transition: opacity 0.28s ease, transform 0.28s cubic-bezier(0.22,1,0.36,1);
      white-space: nowrap;
    }
    .dyn-word.active  { opacity: 1; transform: translateY(0); }
    .dyn-word.exit    { opacity: 0; transform: translateY(-110%); transition: opacity 0.22s ease, transform 0.22s ease; }

    .card-quote-body {
      font-family: 'DM Sans', sans-serif;
      font-size: clamp(13px, 1.2vw, 16px);
      font-weight: 300;
      color: #1a1a1a;
      line-height: 1.75;
      margin-top: 22px;
    }

    /* ── Card: Right text (row 2, col 3) ── */
    .card-text-right {
      grid-column: 3;
      grid-row: 2;
      background: #fff;
      border: 1px solid #e4e4e4;
      padding: clamp(22px, 2.8vw, 38px);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .card-text-right p {
      font-family: 'DM Sans', sans-serif;
      font-size: clamp(13px, 1.2vw, 16px);
      font-weight: 300;
      color: #1a1a1a;
      line-height: 1.75;
    }
    .card-text-right .author {
      margin-top: 28px;
      font-family: 'DM Sans', sans-serif;
      font-size: clamp(13px, 1.1vw, 15px);
      font-weight: 500;
      color: #1a1a1a;
      text-align: right;
    }
    .card-text-right .author span {
      display: block;
      font-weight: 300;
      color: #E8321A;
      font-size: 13px;
      margin-top: 3px;
    }

    /* ── Card: Contact CTA — row 1, col 3 ── */
    .card-contact {
      grid-column: 3;
      grid-row: 1;
      background: #fff;
      border: 1px solid #e4e4e4;
      padding: 18px 28px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      border-radius: 14px;
    }
    .card-contact-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .card-contact-dot {
      width: 10px; height: 10px;
      background: #E8321A;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .card-contact-text {
      font-family: 'DM Sans', sans-serif;
      font-size: clamp(14px, 1.25vw, 17px);
      font-weight: 400;
      color: #1a1a1a;
    }
    .card-contact-arrow {
      width: 34px; height: 34px;
      border: 1.5px solid #ccc;
      border-radius: 6px;
      display: flex; align-items: center; justify-content: center;
      transition: border-color 0.3s, background 0.3s;
      text-decoration: none;
      flex-shrink: 0;
    }
    .card-contact-arrow:hover { border-color: #E8321A; background: #E8321A; }
    .card-contact-arrow:hover svg path { stroke: #fff; }

    /* ── Responsive ── */
    @media (max-width: 960px) {
      #section-innovar {
        height: auto;
        padding: clamp(32px, 5vw, 56px) clamp(20px, 4vw, 48px);
      }
      .s2-header { grid-template-columns: 1fr auto; grid-template-rows: auto auto; }
      .s2-header-title-block { grid-column: 1; grid-row: 1; white-space: normal; }
      .s2-body-text { grid-column: 1; grid-row: 2; }
      .s2-cta { grid-column: 2; grid-row: 1; align-self: center; }
      .s2-grid {
        flex: unset;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: auto 1fr auto;
      }
      .card-logos      { grid-column: 1; grid-row: 1; }
      .card-photo      { grid-column: 2; grid-row: 1 / 3; min-height: 400px; }
      .card-text-right { grid-column: 1; grid-row: 2; }
      .card-quote      { grid-column: 1; grid-row: 3; }
      .card-contact    { grid-column: 2; grid-row: 3; }
    }
    @media (max-width: 600px) {
      #section-innovar { height: auto; }
      .s2-header { grid-template-columns: 1fr; }
      .s2-cta { grid-column: 1; grid-row: auto; justify-self: start; }
      .s2-grid {
        grid-template-columns: 1fr;
        grid-template-rows: auto;
      }
      .card-logos      { grid-column: 1; grid-row: auto; }
      .card-photo      { grid-column: 1; grid-row: auto; min-height: 480px; }
      .card-text-right { grid-column: 1; grid-row: auto; }
      .card-quote      { grid-column: 1; grid-row: auto; }
      .card-contact    { grid-column: 1; grid-row: auto; }
    }
    /* ═══════════════════════════════════════════════
       SECTION 3 — SERVICIOS  (Altrum scroll-stack)
    ═══════════════════════════════════════════════ */

    /* ── Wrapper — header + scroll-stack container ── */
    #section-servicios {
      background: #fff;
      padding: clamp(32px, 4vh, 56px) clamp(24px, 5vw, 80px) 0;
      box-sizing: border-box;
    }

    /* ── Header (same as S2) ── */
    .s3-header {
      display: grid;
      grid-template-columns: auto 1fr auto;
      grid-template-rows: auto auto;
      column-gap: 40px;
      row-gap: clamp(8px, 1.2vh, 16px);
      align-items: center;
      margin-bottom: clamp(20px, 3vh, 36px);
    }
    .s3-header-title-block {
      grid-column: 1;
      grid-row: 1;
      display: flex;
      align-items: center;
      gap: 12px;
      white-space: nowrap;
    }
    .s3-title-eyebrow {
      display: flex;
      flex-direction: column;
      gap: 4px;
      flex-shrink: 0;
    }
    .s3-title-eyebrow span {
      display: block;
      height: 2.5px;
      background: #E8321A;
      border-radius: 2px;
    }
    .s3-title-eyebrow span:nth-child(1) { width: 24px; }
    .s3-title-eyebrow span:nth-child(2) { width: 18px; }
    .s3-heading {
      font-family: 'DM Sans', sans-serif;
      font-size: clamp(20px, 2.6vw, 38px);
      font-weight: 700;
      color: #1a1a1a;
      line-height: 1.1;
      letter-spacing: -0.01em;
      white-space: nowrap;
    }
    .s3-heading span { color: #E8321A; }
    .s3-header-body {
      grid-column: 1 / 3;
      grid-row: 2;
      font-family: 'DM Sans', sans-serif;
      font-size: clamp(13px, 1.15vw, 15px);
      font-weight: 300;
      color: #444;
      line-height: 1.75;
    }
    .s3-header-body em { font-style: italic; color: #E8321A; font-weight: 400; }

    /* ── Scroll-stack outer ── */
    /* Each card is sticky inside this container.
       Height = N cards × card-height + a little extra for the last card to fully enter.
       We use 85vh per card so at 4 cards → 4 × 85vh = 340vh, plus initial offset.      */
    .s3-stack {
      position: relative;
      /* 4 cards × 85vh each = 340vh scroll range */
      height: calc(4 * 85vh);
    }

    /* ── Individual card — sticky at top, 85vh tall, same as original ── */
    .s3-card-wrap {
      position: sticky;
      top: 0;
      height: 85vh;
      /* Each card stacks on top of previous using z-index */
    }
    .s3-card-wrap:nth-child(1) { z-index: 1; }
    .s3-card-wrap:nth-child(2) { z-index: 2; }
    .s3-card-wrap:nth-child(3) { z-index: 3; }
    .s3-card-wrap:nth-child(4) { z-index: 4; }

    /* The actual card visual — inset inside wrap for the "grow from small" effect */
    .s3-card {
      width: 100%;
      height: 100%;
      border-radius: 20px;
      overflow: hidden;
      background: #fff;
      position: relative;
      /* GSAP will animate scale + rotate from JS */
      transform-origin: center center;
      will-change: transform;
    }

    /* ── Photo fills the card ── */
    .s3-photo {
      width: 100%;
      height: 100%;
      object-fit: contain;
      object-position: center center;
      display: block;
      /* GSAP will scale the photo counter to the card scale for parallax */
      transform-origin: center center;
      will-change: transform;
    }

    /* ── Service label — bottom-right, same as before ── */
    .s3-overlay {
      position: absolute;
      inset: 0;
      z-index: 2;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: flex-end;
      padding: 0 clamp(28px, 49vw, 72px) clamp(6%, 8vh, 10%) clamp(28px, 4vw, 72px);
      pointer-events: none;
    }
    .s3-title-block {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 2px;
      text-align: left;
      /* GSAP will animate translateY + opacity on scroll-exit */
      will-change: transform, opacity;
    }
    .s3-title-num {
      font-family: 'DM Sans', sans-serif;
      font-size: clamp(12px, 1.2vw, 18px);
      font-weight: 900;
      color: rgba(255,255,255,0.75);
      white-space: nowrap;
    }
    .s3-title-text {
      font-family: 'DM Sans', sans-serif;
      font-size: clamp(22px, 3.2vw, 52px);
      font-weight: 900;
      color: #fff;
      line-height: 1.0;
      letter-spacing: -0.02em;
      text-align: left;
    }
    .s3-service-desc {
      font-family: 'DM Sans', sans-serif;
      font-size: clamp(11px, 1.0vw, 14px);
      font-weight: 400;
      color: #fff;
      line-height: 1.55;
      letter-spacing: 0;
      text-align: left;
      margin-top: clamp(6px, 0.8vh, 10px);
      /* Prevent overflow on narrow viewports — inherits overlay width naturally */
      overflow-wrap: break-word;
      word-break: break-word;
    }

    /* ── Responsive desc size ── */
    @media (max-width: 1024px) {
      .s3-service-desc { font-size: clamp(10px, 1.1vw, 13px); }
    }
    @media (max-width: 768px) {
      .s3-service-desc { font-size: clamp(10px, 2.2vw, 13px); }
    }
    @media (max-width: 480px) {
      .s3-service-desc { font-size: clamp(9px, 2.5vw, 11px); }
    }

    /* ── Nav — top-right, same as before ── */
    .s3-nav {
      position: absolute;
      top: clamp(16px, 2.5vh, 28px);
      right: clamp(20px, 2.5vw, 40px);
      display: flex;
      flex-direction: column;
      gap: 0;
      z-index: 3;
      align-items: flex-end;
      pointer-events: all;
    }
    .s3-nav-item {
      background: none;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 5px 0;
      text-align: right;
      border-bottom: 1px solid rgba(139,140,142,0.25);
    }
    .s3-nav-item:last-child { border-bottom: none; }
    .s3-nav-num, .s3-nav-label {
      font-family: 'DM Sans', sans-serif;
      font-size: clamp(14px, 1.35vw, 20px);
      font-weight: 900;
      color: #8b8c8e;
      white-space: nowrap;
      transition: color 0.3s;
    }
    .s3-nav-item.active .s3-nav-num,
    .s3-nav-item.active .s3-nav-label { color: #ff4808; }
    .s3-nav-item:hover .s3-nav-num,
    .s3-nav-item:hover .s3-nav-label  { color: #ff4808; }

    /* ── Section divider ── */
    .s-divider-wrap {
      padding: clamp(32px, 5vh, 64px) clamp(24px, 5vw, 80px);
      background: #fff;
    }
    .s-divider {
      border: none;
      border-top: 1px solid #e0e0e0;
      margin: 0;
    }

    /* ── Responsive ── */
    @media (max-width: 1024px) {
      .s3-title-text { font-size: clamp(18px, 3vw, 40px); }
      .s3-title-num  { font-size: clamp(11px, 1.2vw, 16px); }
    }
    @media (max-width: 768px) {
      #section-servicios { padding: 20px 20px 0; }
      .s3-header { grid-template-columns: 1fr; }
      .s3-header-title-block { white-space: normal; }
      .s3-stack { height: calc(4 * 70vh); }
      .s3-card-wrap { height: 70vh; }
      .s3-title-text { font-size: clamp(14px, 4.5vw, 28px); }
      .s3-title-num  { font-size: clamp(10px, 2vw, 14px); }
      .s3-nav { top: 10px; right: 10px; }
      .s3-nav-num, .s3-nav-label { font-size: clamp(11px, 2.5vw, 15px); }
    }
    @media (max-width: 480px) {
      .s3-stack { height: calc(4 * 60vh); }
      .s3-card-wrap { height: 60vh; }
      .s3-title-text { font-size: clamp(12px, 5vw, 22px); }
      .s3-title-num  { font-size: 10px; }
    }

  </style>
</head>
<body>

  <!-- ══════════ LOADER ══════════ -->
  <div id="loader">

    <div class="loader-brand" id="loaderBrand">
      <!-- characters injected by JS -->
    </div>

    <div class="loader-tagline">
      <span class="tagline-slash">//</span>

      <div class="word-container">
        <span class="word-item" id="w0">Visión</span>
        <span class="word-item" id="w1">Diseño</span>
        <span class="word-item" id="w2">Construcción</span>
        <span class="word-item" id="w3">Impacto</span>
      </div>

      <span class="tagline-slash">//</span>
    </div>

  </div>

  <!-- ══════════ SITE ══════════ -->
  <div id="site">

    <div id="nav-overlay">
      <a class="nav-item" href="#">Visión</a>
      <a class="nav-item" href="#">Servicios</a>
      <a class="nav-item" href="#">Proyectos</a>
      <a class="nav-item" href="#">Contacto</a>
    </div>

    <section id="hero">
      <img class="hero-image" src="/images/hero-2x.jpg" alt="Brandtoria" />
      <div class="hero-overlay"></div>

      <div class="top-bar">
        <button class="hamburger" id="hamburger" aria-label="Menú" aria-expanded="false">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <div class="deco-slash">
        <span></span>
        <span></span>
      </div>

      <div class="hero-brand">
        <div class="hero-brand-name">
          <span style="color:#1a1a1a;">BRANDTOR</span><span style="color:#E8321A;">I</span><span style="color:#E8321A;">A</span><span style="color:#E8321A;">.</span>
        </div>
        <div class="hero-subtitle">El ecosistema creativo de la Era Exponencial</div>
      </div>

      <div class="scroll-indicator">
        <div class="scroll-text">scroll</div>
        <div class="scroll-arrows">
          <span></span><span></span><span></span>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════
         SECTION 2 — NOS ESFORZAMOS POR INNOVAR
    ══════════════════════════════════════════════ -->
    <section id="section-innovar">

      <!-- Header
           Fila 1: [// título]  [col 2 vacío auto]  [CTA →]
           Fila 2: [párrafo col 1+2 ──────────────]  [col 3 vacío]
      -->
      <div class="s2-header">
        <div class="s2-header-title-block">
          <div class="s2-eyebrow-slashes">
            <span></span><span></span>
          </div>
          <h2 class="s2-title">Nos esforzamos por <span>innovar</span></h2>
        </div>
        <a href="#" class="s2-cta">
          Comienza con tu ADN
          <span class="s2-cta-icon">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 12L12 2M12 2H5M12 2V9" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
        </a>
        <p class="s2-body-text">
          Ya estamos viviendo la <em>era exponencial</em> — donde la tecnología cambia más rápido de lo que la mayoría de los negocios puede seguir. Una <em>estrategia sólida</em>, alineada con las necesidades del negocio y un análisis de datos robusto son ingredientes fundamentales para extraer información accionable.
        </p>
      </div>

      <!-- Cards grid -->
      <div class="s2-grid" id="s2Grid">

        <!-- Card 1: Logos -->
        <div class="s2-card card-logos">
          <img src="/images/logo-fumakilla.jpg" alt="Fumakilla" />
          <img src="/images/logo-jaguey.jpg" alt="Instituto Jagüey" />
          <img src="/images/logo-medicasur.jpg" alt="MédicaSur" />
          <img src="/images/logo-vans.jpg" alt="Vans" />
          <span class="card-logos-more">...y muchas más.</span>
        </div>

        <!-- Card 2 (center, spans rows 1+2): Photo -->
        <div class="s2-card card-photo">
          <div class="card-photo-img">
            <img src="/images/section2-photo-final.jpg" alt="Sandra LoeSarabi con robots" />
          </div>
          <div class="card-photo-footer">
            <span class="card-photo-brand">BRANDTORIA<span class="dot">.</span></span>
          </div>
        </div>

        <!-- Card 3: Right text -->
        <div class="s2-card card-text-right">
          <p>Los resultados óptimos, nunca son casualidad. Es ingeniería creativa, escucha real y obsesión por el detalle — potenciadas, no reemplazadas, por la tecnología. La IA sin criterio sólo produce más de lo mismo, más rápido. La diferencia no es tener las herramientas. Es saber exactamente cómo usarlas: con responsabilidad y expertise.</p>
          <div class="author">
            Sandra LoeSarabi
            <span>Fundadora de Brandtoria.</span>
          </div>
        </div>

        <!-- Card 4: Quote with dynamic word -->
        <div class="s2-card card-quote">
          <div>
            <div class="card-quote-mark">&ldquo;</div>
            <div class="card-quote-text">
              Somos un ecosistema digital creativo, para desarrollar el futuro de tu
              <span class="dyn-word-wrap" id="dynWordWrap">
                <span class="dyn-word" id="dw0">narrativa.</span>
                <span class="dyn-word" id="dw1">presencia.</span>
                <span class="dyn-word" id="dw2">marca.</span>
                <span class="dyn-word" id="dw3">experiencia.</span>
              </span>
            </div>
          </div>
          <p class="card-quote-body">Creamos ecosistemas visuales de alto impacto creativo y duradero. Donde convergen la construcción de marca, los datos, la estrategia, la innovación y la tecnología, para blindar tu futuro comercial y operativo.</p>
        </div>

        <!-- Card 5: Contact CTA -->
        <div class="s2-card card-contact">
          <div class="card-contact-left">
            <div class="card-contact-dot"></div>
            <span class="card-contact-text">Hablemos de tu proyecto.</span>
          </div>
          <a href="#" class="card-contact-arrow">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 12L12 2M12 2H5M12 2V9" stroke="#1a1a1a" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>
        </div>

      </div>
    </section>

    <!-- ── Divider between S2 and S3 ── -->
    <div class="s-divider-wrap">
      <hr class="s-divider" />
    </div>

    <!-- ══════════════════════════════════════════════
         SECTION 3 — SERVICIOS  (Altrum scroll-stack)
    ══════════════════════════════════════════════ -->
    <section id="section-servicios">

      <!-- S3 Header -->
      <div class="s3-header">
        <div class="s3-header-title-block">
          <div class="s3-title-eyebrow">
            <span></span><span></span>
          </div>
          <h2 class="s3-heading">Nuestros <span>servicios</span></h2>
        </div>
        <p class="s3-header-body">
          Cada servicio es una <em>palanca de crecimiento</em> diseñada para amplificar tu marca, automatizar tus procesos y generar resultados medibles — con tecnología de vanguardia y creatividad sin límites.
        </p>
      </div>

      <!-- Scroll-stack: 4 sticky cards, one per service -->
      <div class="s3-stack" id="s3Stack">

        <!-- Card 01 — Agentes AI -->
        <div class="s3-card-wrap" data-s3-card="0">
          <div class="s3-card">
            <img class="s3-photo" src="/images/s3-agentes-ai.png" alt="Agentes AI" />
            <nav class="s3-nav">
              <button class="s3-nav-item active" data-card="0">
                <span class="s3-nav-num">(01)</span>
                <span class="s3-nav-label">Agentes AI</span>
              </button>
              <button class="s3-nav-item" data-card="1">
                <span class="s3-nav-num">(02)</span>
                <span class="s3-nav-label">Diseño Web UX/UI</span>
              </button>
              <button class="s3-nav-item" data-card="2">
                <span class="s3-nav-num">(03)</span>
                <span class="s3-nav-label">Branding</span>
              </button>
              <button class="s3-nav-item" data-card="3">
                <span class="s3-nav-num">(04)</span>
                <span class="s3-nav-label">Foto &amp; Video</span>
              </button>
            </nav>
            <div class="s3-overlay">
              <div class="s3-title-block">
                <span class="s3-title-num">(01)</span>
                <h2 class="s3-title-text">Instalación de<br>Agentes de AI</h2>
                <p class="s3-service-desc">Instalamos agentes de AI, que aprenden de ti y tu negocio para: Decidir. Ejecutar. Conectar con tus herramientas y Terminar las tareas por ti — mientras duermes.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Card 02 — Diseño Web UX/UI -->
        <div class="s3-card-wrap" data-s3-card="1">
          <div class="s3-card">
            <img class="s3-photo" src="/images/s3-diseno-web.png" alt="Diseño Web UX/UI" />
            <nav class="s3-nav">
              <button class="s3-nav-item" data-card="0">
                <span class="s3-nav-num">(01)</span>
                <span class="s3-nav-label">Agentes AI</span>
              </button>
              <button class="s3-nav-item active" data-card="1">
                <span class="s3-nav-num">(02)</span>
                <span class="s3-nav-label">Diseño Web UX/UI</span>
              </button>
              <button class="s3-nav-item" data-card="2">
                <span class="s3-nav-num">(03)</span>
                <span class="s3-nav-label">Branding</span>
              </button>
              <button class="s3-nav-item" data-card="3">
                <span class="s3-nav-num">(04)</span>
                <span class="s3-nav-label">Foto &amp; Video</span>
              </button>
            </nav>
            <div class="s3-overlay">
              <div class="s3-title-block">
                <span class="s3-title-num">(02)</span>
                <h2 class="s3-title-text">Diseño Web<br>UX / UI</h2>
                <p class="s3-service-desc">Desarrollamos experiencias digitales cuidadosamente diseñadas para maximizar la participación y mejorar la usabilidad. Con integración de Agentes AI.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Card 03 — Branding -->
        <div class="s3-card-wrap" data-s3-card="2">
          <div class="s3-card">
            <img class="s3-photo" src="/images/s3-branding.png" alt="Branding" />
            <nav class="s3-nav">
              <button class="s3-nav-item" data-card="0">
                <span class="s3-nav-num">(01)</span>
                <span class="s3-nav-label">Agentes AI</span>
              </button>
              <button class="s3-nav-item" data-card="1">
                <span class="s3-nav-num">(02)</span>
                <span class="s3-nav-label">Diseño Web UX/UI</span>
              </button>
              <button class="s3-nav-item active" data-card="2">
                <span class="s3-nav-num">(03)</span>
                <span class="s3-nav-label">Branding</span>
              </button>
              <button class="s3-nav-item" data-card="3">
                <span class="s3-nav-num">(04)</span>
                <span class="s3-nav-label">Foto &amp; Video</span>
              </button>
            </nav>
            <div class="s3-overlay">
              <div class="s3-title-block">
                <span class="s3-title-num">(03)</span>
                <h2 class="s3-title-text">Branding &amp;<br>Identidad Visual</h2>
                <p class="s3-service-desc">Identidades visuales estructuradas y diseñadas para posicionar, diferenciar y escalar con precisión y claridad.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Card 04 — Foto & Video -->
        <div class="s3-card-wrap" data-s3-card="3">
          <div class="s3-card">
            <img class="s3-photo" src="/images/s3-foto-video.png" alt="Foto y Video" />
            <nav class="s3-nav">
              <button class="s3-nav-item" data-card="0">
                <span class="s3-nav-num">(01)</span>
                <span class="s3-nav-label">Agentes AI</span>
              </button>
              <button class="s3-nav-item" data-card="1">
                <span class="s3-nav-num">(02)</span>
                <span class="s3-nav-label">Diseño Web UX/UI</span>
              </button>
              <button class="s3-nav-item" data-card="2">
                <span class="s3-nav-num">(03)</span>
                <span class="s3-nav-label">Branding</span>
              </button>
              <button class="s3-nav-item active" data-card="3">
                <span class="s3-nav-num">(04)</span>
                <span class="s3-nav-label">Foto &amp; Video</span>
              </button>
            </nav>
            <div class="s3-overlay">
              <div class="s3-title-block">
                <span class="s3-title-num">(04)</span>
                <h2 class="s3-title-text">Foto &amp;<br>Video</h2>
                <p class="s3-service-desc">Creamos contenido de la más alta calidad, donde la narrativa visual es la clave para que tu marca comunique.</p>
              </div>
            </div>
          </div>
        </div>

      </div><!-- /s3-stack -->

    </section>

  </div>

  <script>
    /* ── BUILD LOADER CHARACTERS ── */
    (function () {
      const container = document.getElementById('loaderBrand');
      // B R A N D T O R I A .
      // idx:  0 1 2 3 4 5 6 7 8 9 10
      const accentIdx = new Set([8, 9, 10]);
      'BRANDTORIA.'.split('').forEach(function(ch, i) {
        var span = document.createElement('span');
        span.classList.add('char');
        span.style.animationDelay = (i * 0.07 + 0.05) + 's';
        span.style.color = accentIdx.has(i) ? '#E8321A' : '#fff';
        span.textContent = ch;
        container.appendChild(span);
      });
    })();

    /* ── WORD CYCLING ── */
    (function () {
      var ids = ['w0','w1','w2','w3'];
      var current = -1;

      function show(idx) {
        ids.forEach(function(id, i) {
          var el = document.getElementById(id);
          el.classList.remove('active','exit');
          if (i === idx) {
            el.classList.add('active');
          }
        });
        current = idx;
      }

      function next() {
        var prev = current;
        var nxt  = (current + 1) % ids.length;
        if (prev >= 0) {
          document.getElementById(ids[prev]).classList.remove('active');
          document.getElementById(ids[prev]).classList.add('exit');
        }
        setTimeout(function(){ show(nxt); }, 60);
      }

      // Start first word after tagline fades in (1.4s delay + 0.5s anim = ~1.9s)
      setTimeout(function(){ show(0); }, 1950);

      // Cycle every 400ms after that
      setTimeout(function(){
        setInterval(next, 400);
      }, 1950 + 400);

      // Exit loader after: 1.95s start + 4 words × 0.4s + 0.4s pause = ~4s
      setTimeout(function(){
        var loader = document.getElementById('loader');
        var site   = document.getElementById('site');
        loader.classList.add('hide');
        site.classList.add('visible');
        setTimeout(function(){ loader.style.display = 'none'; document.documentElement.classList.add('site-ready'); document.body.classList.add('site-ready'); }, 950);
      }, 4000);
    })();

    /* ── SECTION 2: HINGE SCROLL ANIMATION ── */
    (function () {
      var cards = document.querySelectorAll('.s2-card');
      var triggered = false;

      function checkVisible() {
        if (triggered) return;
        var grid = document.getElementById('s2Grid');
        if (!grid) return;
        var rect = grid.getBoundingClientRect();
        var windowH = window.innerHeight;
        // Trigger when the grid center reaches the center of the viewport
        if (rect.top < windowH * 0.82) {
          triggered = true;
          cards.forEach(function(card) {
            card.classList.add('hinge-in');
          });
        }
      }

      window.addEventListener('scroll', checkVisible, { passive: true });
      // Also check on load in case already visible
      setTimeout(checkVisible, 100);
    })();

    /* ── DYNAMIC WORD (section 2) ── */
    (function () {
      var words = ['dw0','dw1','dw2','dw3'];
      var current = -1;

      // Measure widths so wrap container adjusts
      function setWrapWidth(idx) {
        var wrap = document.getElementById('dynWordWrap');
        var el   = document.getElementById(words[idx]);
        if (wrap && el) {
          wrap.style.width = el.offsetWidth + 'px';
        }
      }

      function showDyn(idx) {
        words.forEach(function(id, i) {
          var el = document.getElementById(id);
          el.classList.remove('active','exit');
          if (i === idx) el.classList.add('active');
        });
        current = idx;
        setWrapWidth(idx);
      }

      function nextDyn() {
        var prev = current;
        var nxt  = (current + 1) % words.length;
        if (prev >= 0) {
          document.getElementById(words[prev]).classList.remove('active');
          document.getElementById(words[prev]).classList.add('exit');
        }
        setTimeout(function(){ showDyn(nxt); }, 60);
      }

      // Start cycling once fonts are likely loaded
      setTimeout(function(){
        showDyn(0);
        setInterval(nextDyn, 2000);
      }, 500);
    })();

    /* ── SECTION 3: ALTRUM SCROLL-STACK ANIMATION ── */
    (function () {
      // ── Load GSAP + ScrollTrigger from CDN ──────────────────────────────
      // (Injected after page load so it doesn't block the main thread)
      function loadScript(url, cb) {
        var s = document.createElement('script');
        s.src = url;
        s.onload = cb;
        document.head.appendChild(s);
      }

      // ── Card scroll animation initializer ───────────────────────────────
      function initS3Animations() {
        var gsap = window.gsap;
        var ST   = window.ScrollTrigger;
        if (!gsap || !ST) return;

        gsap.registerPlugin(ST);

        var cardWraps = document.querySelectorAll('.s3-card-wrap');

        cardWraps.forEach(function(wrap, i) {
          var card      = wrap.querySelector('.s3-card');
          var photo     = wrap.querySelector('.s3-photo');
          var titleBlk  = wrap.querySelector('.s3-title-block');

          // ── ENTRANCE: card grows from small+rotated as it scrolls into view ──
          // start: card enters from 80% down the viewport
          // end:   card is fully centered (top of card hits top of viewport)
          gsap.fromTo(card,
            { scale: 0.72, rotation: 6 },
            {
              scale: 1,
              rotation: 0,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: wrap,
                start: 'top 90%',   // card enters viewport
                end: 'top 0%',      // card reaches sticky position
                scrub: 0.8,
                invalidateOnRefresh: true
              }
            }
          );

          // ── PHOTO counter-scale: stays visually same size while card scales ──
          // (mild zoom-out as card grows — the "Ken Burns in reverse" feel)
          gsap.fromTo(photo,
            { scale: 1.35 },
            {
              scale: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: wrap,
                start: 'top 90%',
                end: 'top 0%',
                scrub: 0.8,
                invalidateOnRefresh: true
              }
            }
          );

          // ── EXIT: title floats up and fades on scroll-out ──
          // The trigger div is the NEXT card wrap (if it exists)
          // so the title exits as the next card covers it.
          if (i < cardWraps.length - 1) {
            var nextWrap = cardWraps[i + 1];
            gsap.to(titleBlk, {
              y: '-8vh',
              opacity: 0,
              ease: 'power1.in',
              scrollTrigger: {
                trigger: nextWrap,
                start: 'top 60%',  // next card halfway into view
                end: 'top 0%',     // next card fully in
                scrub: 0.6,
                invalidateOnRefresh: true
              }
            });
          }
        });

        // ── Nav click: scroll to corresponding card ──────────────────────
        document.querySelectorAll('.s3-nav-item').forEach(function(btn) {
          btn.addEventListener('click', function() {
            var targetIdx = parseInt(btn.getAttribute('data-card'), 10);
            var targetWrap = document.querySelector('.s3-card-wrap[data-s3-card="' + targetIdx + '"]');
            if (!targetWrap) return;
            // scroll so the target card is sticky at top
            var st = targetWrap.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({ top: st, behavior: 'smooth' });
          });
        });
      }

      // ── Chain-load GSAP → ScrollTrigger → init ───────────────────────────
      loadScript('https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js', function() {
        loadScript('https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js', function() {
          initS3Animations();
        });
      });
    })();

    /* ── HAMBURGER ── */
    (function () {
      var btn     = document.getElementById('hamburger');
      var overlay = document.getElementById('nav-overlay');

      btn.addEventListener('click', function(){
        var open = btn.classList.toggle('open');
        overlay.classList.toggle('open', open);
        btn.setAttribute('aria-expanded', String(open));
      });

      overlay.addEventListener('click', function(e){
        if (e.target === overlay) close();
      });

      document.addEventListener('keydown', function(e){
        if (e.key === 'Escape') close();
      });

      function close() {
        btn.classList.remove('open');
        overlay.classList.remove('open');
        btn.setAttribute('aria-expanded','false');
      }
    })();
  </script>

</body>
</html>`)
})

export default app
