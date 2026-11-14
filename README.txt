AzbyGames v6.4 — Single URL / 12 Language Edition

PUBLIC URL: https://azbygames.com/
Every supported locale uses this ONE URL. No /tr/, /index.html, query or hash
appears in the address bar after the site initializes.

DEPLOYMENT — GitHub Pages
1. In the azbygames.github.io repository, use the repository root for deployment.
2. Upload the CONTENTS of this ZIP, not the ZIP itself and not an extra folder.
3. Make sure the NEW root index.html replaced the previous one, along with
   404.html and all language folders. Commit changes.
4. GitHub: Settings > Pages > Custom domain: azbygames.com (Enable HTTPS).
5. Hard refresh the browser (Ctrl+Shift+R) after GitHub Pages publishes.

Do not change Cloudflare DNS or your quizagon.azbygames.com tunnel.

LANGUAGES
English, Turkish, Spanish, Chinese, Hindi, Arabic, Portuguese, French,
Russian, Bengali, Japanese, German (12). Browser-language detection + saved
language preference + instant switch via the same page. Arabic uses RTL.

LEGACY URL HANDLING
/tr/index.html, /de/, etc. redirect to / with locale preference;
/index.html cleans itself to / without a second page load.
404.html handles old /tr/index or other aliases if directly requested.

The site is static. Contact form opens the visitor's email app; no message
is sent automatically. Logo files and design are unchanged from v6.3.
