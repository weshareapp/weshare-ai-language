(() => {
  try {
    const DEFAULT_LANG = 'en';
    const API_ENDPOINT = 'https://weshare-ai-language.vercel.app/api/translate';

    const phrasesToTranslate = {
      "search": "Search for social sharing networks",
      "copy": "Copy Link",
      "follow": "Follow",
      "email": "Share via Email",
      "blog": "Post to your blog",
      "any": "Share to any service"
    };

    const detectLang = () => {
      const navLang = navigator.language || navigator.userLanguage;
      return navLang ? navLang.split('-')[0] : DEFAULT_LANG;
    };

    const translateText = async (text, lang) => {
      try {
        const res = await fetch(`${API_ENDPOINT}?lang=${lang}&text=${encodeURIComponent(text)}`);
        const data = await res.json();
        return data.translated || text;
      } catch (err) {
        console.error('[WeShare AI Language] Translation failed for:', text);
        return text;
      }
    };

    const translateAll = async () => {
      const lang = detectLang();
      if (lang === DEFAULT_LANG) return;

      for (const [key, text] of Object.entries(phrasesToTranslate)) {
        const translated = await translateText(text, lang);
        const targets = document.querySelectorAll(`[data-weshare-i18n="${key}"]`);
        targets.forEach(el => {
          if (el.placeholder) el.placeholder = translated;
          else el.innerText = translated;
        });
      }

      if (window.gtag) {
        gtag('event', 'language_activated', { lang_code: lang });
      }
    };

    // Safe load trigger
    window.addEventListener('load', () => {
      if (typeof e_mailit === "undefined" || !document.querySelector("#e-mailit_menu")) {
        console.warn("[WeShare AI Language] Skipping — e_mailit or menu not ready.");
        return;
      }
      translateAll();
    });

  } catch (e) {
    console.error('[WeShare AI Language] Fatal error:', e);
  }
})();
