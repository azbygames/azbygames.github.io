AzbyGames — Asset Notes
========================

Theme-aware brand assets
  All brand assets live in /assets/brand/ and come in paired light/dark variants.
  The site automatically shows the correct version based on the active theme:
    - Light mode  →  *-light.*  (white background, black text)
    - Dark mode   →  *-dark.*   (black background, white text)

  assets/brand/azby-icon-light.webp + .png   — 128x128 icon (light mode)
  assets/brand/azby-icon-dark.webp  + .jpg   — 128x128 icon (dark mode)
  assets/brand/azby-logo-light.webp + .jpg   — 1080x1080 full logo (light mode)
  assets/brand/azby-logo-dark.webp  + .jpg   — 1080x1080 full logo (dark mode)
  assets/brand/azby-banner-light.webp + .jpg — 1280x720 banner (light mode)
  assets/brand/azby-banner-dark.webp  + .jpg — 1280x720 banner (dark mode)

  Usage in the site:
    - Nav (top-left):    azby-icon-*     (48x48 displayed)
    - Studio section:    azby-logo-*     (in the studio-brand panel)
    - Studio section:    azby-banner-*   (full-width showcase below the bento grid)
    - Footer:            azby-icon-*     (32x32 displayed)

  The theme switching is CSS-only (no JS needed for the swap). Both variants
  are preloaded with opacity:0/visibility:hidden so the switch is instant.

Promo video
  Expected at: assets/quizagon_tanitim.webp
  Format: Animated WebP (image format, auto-loops in all modern browsers)
  Resolution: 640x1138 (vertical/phone)
  Displayed inside a phone mockup in the promo section of the Quizagon page.
  Drop the file into /assets/ and it will auto-play and loop.

  If your source is a video (mp4/webm), convert it first:
    ffmpeg -i input.mp4 -vf "scale=640:1138,fps=10" -loop 0 \
      -c:v libwebp_anim -q:v 70 assets/quizagon_tanitim.webp
