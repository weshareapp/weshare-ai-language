
/**
 * WeShare AI Language Switcher
 * AI-powered dynamic translation based on browser language + geolocation
 * https://weshare-ai-language.vercel.app/api/translate
 */

(function () {
  const phrasesToTranslate = {
    search: "Search for social sharing networks",
    copy: "Copy Link",
    follow: "Follow",
    email: "Share via Email",
    blog: "Post to your blog",
    any: "Share to any service",
  };

  const getBrowserLanguage = () => {
    const lang = navigator.language || navigator.userLanguage;
    return lang.split("-")[0].toLowerCase();
  };

  const sendGAEvent = (language) => {
    if (typeof gtag === "function") {
      gtag("event", "weshare_language_detected", {
        language,
        ai_activated: true,
      });
    }
  };

  const translateText = async (text, lang) => {
    const endpoint = "https://weshare-ai-language.vercel.app/api/translate";
    try {
      const res = await fetch(endpoint + "?lang=" + lang + "&text=" + encodeURIComponent(text));
      const data = await res.json();
      if (data.translated) {
        console.log("[WeShare AI Language] Translated:", text, "→", data.translated);
        return data.translated;
      } else {
        console.warn("[WeShare AI Language] Translation failed for:", text);
        return text;
      }
    } catch (error) {
      console.error("[WeShare AI Language] Error:", error);
      return text;
    }
  };

  const translatePhrases = async (lang) => {
    const elements = document.querySelectorAll("[data-weshare-i18n]");
    for (const el of elements) {
      const key = el.getAttribute("data-weshare-i18n");
      const original = phrasesToTranslate[key];
      if (!original) continue;
      const translated = await translateText(original, lang);
      el.innerText = translated;
    }
  };

  const runTranslationModule = async () => {
    const lang = getBrowserLanguage();
    console.log("[WeShare AI Language] Browser language detected:", lang);
    sendGAEvent(lang);
    await translatePhrases(lang);
  };

  const waitForEMailit = () => {
    return new Promise((resolve) => {
      const check = () => {
        if (window.e_mailit && window.e_mailit.menu && typeof e_mailit.menu.open === "function") {
          resolve();
        } else {
          setTimeout(check, 100);
        }
      };
      check();
    });
  };

  window.addEventListener("load", () => {
    waitForEMailit().then(() => {
      console.log("[WeShare AI Language] e_mailit ready — running translation");
      runTranslationModule();
    });
  });
})();
