# WeShare AI Language Translation API

This is a Vercel-compatible API function for real-time language translation using OpenAI.

🧠 The official AI-powered dynamic translation system by [WeShare](https://weshareapp.io/), built for real-time language switching without profiling users.  
🌍 Supports 20 major languages — plug & play — GDPR-compliant.

---

## 🧩 Overview

This repository contains the live Vercel deployment of the AI-based translation API used by `weshare-language-ai.js`.

It detects the user's preferred language (via browser + geolocation signals) and dynamically translates visible UI text, share button labels, and thank-you messages.

---

## 🚀 API Endpoint

**POST** [`/api/translate`](https://weshare-ai-language-git-main-nikitas-georgopoulos-projects.vercel.app/api/translate)

### Example request:
```json
{
  "targetLang": "fr",
  "strings": [
    "Share to any service",
    "Copy Link",
    "Search for social sharing networks"
  ]
}
{
  "translations": [
    "Partager vers n'importe quel service",
    "Copier le lien",
    "Rechercher des réseaux sociaux"
  ]
}

<!-- WeShare AI Language Loader -->
<script src="https://weshare-ai-language.vercel.app/weshare-language-ai.min.js" defer></script>

<!-- WeShare AI Language Patch -->
<script src="https://weshareapp.io/widget/menu3x/js/weshare-language-patch-ai.js" defer></script>

This module runs before button.js and injects the translated phrases into the global window._weshareLangMap, used across the WeShare Button ecosystem.

Supported languages (20)
Japanese, English, Italian, Spanish, Greek, Hindi, Polish, Chinese (Simplified), French, German, Korean, Portuguese, Russian, Arabic, Dutch, Vietnamese, Estonian, Thai, Czech, Danish

Privacy
WeShare does not collect personal identifiable information (PII).
This AI module operates contextually without any user profiling.
All data exchanged is anonymous and ephemeral.

Deployment
Hosted on Vercel:

Maintainer
Created and maintained by Nikitas Georgopoulos
Part of the WeShare initiative

---
