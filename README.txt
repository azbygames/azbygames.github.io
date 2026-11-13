AzbyGames — responsive static website (V3)

Upload the CONTENTS of this folder to azbygames.com web root, preserving /assets and language subfolders.

Features:
- Static human-readable localized HTML for 12 languages, switcher, browser-language redirect on root.
- Per-language canonical URLs, hreflang, JSON-LD, Open Graph, sitemap, robots.txt and llms.txt.
- CSS-based soft lighting, grid, lightweight reveal, reduced-motion support.
- Email form opens the visitor’s email client with a prefilled draft. NO emails are sent automatically.

Important:
- HTTPS must be enabled by your hosting provider.
- For best caching, serve /assets/ with a long cache TTL and HTML with short caching.
- In the Play Console, link to real legal documents only after creating them; no fake policy links are included.
- Add verified store URLs when Quizagon is published.
- Lighthouse and search rankings have not been measured on a live domain; run Lighthouse after publishing.
- Languages are localized as separate static pages; correct spelling/translation should be reviewed by native speakers before launch.

V4 fixes:
- Square Quizagon image enforced in CSS; no tall distorted artwork.
- AzbyGames_logo.jpg featured in Studio section across all languages.
- Language links point to explicit index.html, so they work via local file:// browser and on web hosting.
- Home page uses browser language on first visit, local manual selection takes precedence.
- To reset old language selection, remove browser storage key azbygames-language-v4.
