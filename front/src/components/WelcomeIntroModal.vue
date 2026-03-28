<script setup lang="ts">
const SESSION_KEY = 'artchive_welcome_intro_seen';

/** Surcharge possible avec VITE_TWITTER_URL dans front/.env */
const DEFAULT_TWITTER_PROFILE_URL = 'https://x.com/Yoshik0_';

const twitterProfileHref =
  (import.meta.env.VITE_TWITTER_URL as string | undefined)?.trim() ||
  DEFAULT_TWITTER_PROFILE_URL;

type WelcomeLocale = 'fr' | 'en' | 'es' | 'pt' | 'zh' | 'ja';

type TranslationNoteLocale = Exclude<WelcomeLocale, 'fr' | 'en'>;

const TRANSLATION_NOTE_LOCALES: TranslationNoteLocale[] = [
  'es',
  'pt',
  'zh',
  'ja',
];

const TRANSLATION_NOTE: Record<TranslationNoteLocale, string> = {
  es: 'El español no es un idioma que practique; si el texto no es correcto, escríbeme en Twitter.',
  pt: 'O português não é uma língua que eu pratique; se o texto não estiver correto, escreva-me no Twitter.',
  zh: '中文并非我日常使用的语言；若译文不够准确，欢迎直接在 Twitter 上联系我。',
  ja: '日本語は得意な言語ではありません。表現に不自然な点があれば、Twitterで直接ご連絡ください。',
};

const LOCALE_OPTIONS: { code: WelcomeLocale; label: string }[] = [
  { code: 'fr', label: 'FR' },
  { code: 'en', label: 'EN' },
  { code: 'es', label: 'ES' },
  { code: 'pt', label: 'PT' },
  { code: 'zh', label: '中文' },
  { code: 'ja', label: '日本語' },
];

const COPY: Record<
  WelcomeLocale,
  { title: string; paragraphs: string[]; dismiss: string }
> = {
  fr: {
    title: 'Bienvenue !',
    paragraphs: [
      'Ce site est un petit projet perso qui me permet de mettre en avant certains artistes que j\'apprécie particulièrement.',
      'Vous pouvez explorer aléatoirement certaines de leurs oeuvres sur la homepage.',
      'Sur le lien à côté, vous pouvez découvrir l\'univers d\'un artiste en particulier.',
      'S\'il-vous-plaît, n\'hésitez pas à aller découvrir leurs univers sur leurs réseaux sociaux & shops en ligne.',
    ],
    dismiss: 'J’ai compris',
  },
  en: {
    title: 'Welcome!',
    paragraphs: [
      'This site is a personal project I made to highlight artists I especially appreciate.',
      'On the homepage, you can browse some of their work at random.',
      'The link next to it lets you explore one artist\'s world in particular.',
      'Please do check out their works on their social media and online shops.',
    ],
    dismiss: 'Got it',
  },
  es: {
    title: '¡Bienvenido!',
    paragraphs: [
      'Este sitio es un pequeño proyecto personal con el que quiero dar visibilidad a artistas que aprecio especialmente.',
      'En la página de inicio puedes explorar al azar algunas de sus obras.',
      'En el enlace de al lado puedes descubrir el universo de un artista en concreto.',
      'No dudes en descubrir sus universos en sus redes sociales y tiendas online.',
    ],
    dismiss: 'Entendido',
  },
  pt: {
    title: 'Bem-vindo!',
    paragraphs: [
      'Este site é um pequeno projeto pessoal para dar destaque a artistas de que gosto particularmente.',
      'Na página inicial pode explorar ao acaso algumas das obras deles.',
      'No link ao lado pode descobrir o universo de um artista em particular.',
      'Não hesite em descobrir os universos deles nas redes sociais e nas lojas online.',
    ],
    dismiss: 'Entendi',
  },
  zh: {
    title: '欢迎！',
    paragraphs: [
      '这个网站是我的个人小项目，用来介绍我特别欣赏的一些艺术家。',
      '在首页你可以随机浏览他们的一些作品。',
      '旁边的链接可以带你了解某一位艺术家的创作世界。',
      '也欢迎你在他们的社交媒体和网店上继续探索他们的世界。',
    ],
    dismiss: '知道了',
  },
  ja: {
    title: 'ようこそ！',
    paragraphs: [
      'このサイトは、私が特に応援したいアーティストを紹介する、個人的な小さなプロジェクトです。',
      'トップページでは、彼らの作品をいくつかランダムにご覧いただけます。',
      'その横のリンクから、特定のアーティストの世界をのぞいてみられます。',
      'ぜひSNSやオンラインショップでも、彼らの世界を覗いてみてください。',
    ],
    dismiss: '閉じる',
  },
};

const visible = ref(false);
const locale = ref<WelcomeLocale>('fr');

function detectLocale(): WelcomeLocale {
  const lang = navigator.language.toLowerCase();
  if (lang.startsWith('zh')) { return 'zh'; }
  if (lang.startsWith('ja')) { return 'ja'; }
  if (lang.startsWith('pt')) { return 'pt'; }
  if (lang.startsWith('es')) { return 'es'; }
  if (lang.startsWith('en')) { return 'en'; }
  if (lang.startsWith('fr')) { return 'fr'; }
  return 'fr';
}

onMounted(() => {
  if (!sessionStorage.getItem(SESSION_KEY)) {
    locale.value = detectLocale();
    visible.value = true;
  }
});

function dismiss() {
  sessionStorage.setItem(SESSION_KEY, '1');
  visible.value = false;
}

useEventListener('keydown', (event: KeyboardEvent) => {
  if (event.key === 'Escape' && visible.value) { dismiss(); }
});

const activeCopy = computed(() => COPY[locale.value]);

const isCjk = computed(() => locale.value === 'zh' || locale.value === 'ja');

const showTranslationNote = computed(() =>
  TRANSLATION_NOTE_LOCALES.includes(locale.value as TranslationNoteLocale),
);

const translationNoteText = computed(() => {
  if (!showTranslationNote.value) {
    return '';
  }
  return TRANSLATION_NOTE[locale.value as TranslationNoteLocale];
});
</script>

<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="welcome_overlay"
      role="presentation"
      @click.self="dismiss"
    >
      <div
        class="welcome_panel"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="`welcome-title-${locale}`"
      >
        <div class="welcome_top">
          <div class="welcome_lang" role="tablist" aria-label="Language">
            <button
              v-for="opt in LOCALE_OPTIONS"
              :key="opt.code"
              type="button"
              role="tab"
              :aria-selected="locale === opt.code"
              :class="['lang_btn', { lang_btn_active: locale === opt.code }]"
              @click="locale = opt.code"
            >
              {{ opt.label }}
            </button>
          </div>
        </div>

        <h2 :id="`welcome-title-${locale}`" class="welcome_title">
          {{ activeCopy.title }}
        </h2>
        <div
          class="welcome_body"
          :class="{ welcome_body_cjk: isCjk }"
          :lang="locale === 'zh' ? 'zh-Hans' : locale"
        >
          <p
            v-for="(p, i) in activeCopy.paragraphs"
            :key="`${locale}-${i}`"
            class="welcome_p"
          >
            {{ p }}
          </p>
        </div>
        <button
          type="button"
          class="welcome_dismiss hoverable"
          @click="dismiss"
        >
          {{ activeCopy.dismiss }}
        </button>
        <a
          v-if="showTranslationNote"
          class="welcome_translation_note"
          :class="{ welcome_translation_note_cjk: isCjk }"
          :href="twitterProfileHref"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ translationNoteText }}
        </a>
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
.welcome_overlay {
  position: fixed;
  inset: 0;
  z-index: 1100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.72);
}

.welcome_panel {
  position: relative;
  width: 100%;
  max-width: 28rem;
  max-height: min(90vh, 36rem);
  overflow: auto;
  padding: 1.25rem 1.35rem 1.35rem;
  border-radius: 1rem;
  background: rgb(242, 242, 242);
  color: #191919;
  box-shadow: 0 0.5rem 2rem rgba(0, 0, 0, 0.35);
}

.welcome_top {
  margin-bottom: 0.85rem;
}

.welcome_lang {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.lang_btn {
  padding: 0.35rem 0.55rem;
  border: 1px solid rgba(25, 25, 25, 0.25);
  border-radius: 0.35rem;
  background: transparent;
  color: #191919;
  font: inherit;
  font-size: 0.8rem;
  line-height: 1.2;
  cursor: none !important;

  &:hover {
    border-color: #191919;
  }
}

.lang_btn_active {
  background: #191919;
  color: #f2f2f2;
  border-color: #191919;
}

.welcome_title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  line-height: 1.2;
}

.welcome_body {
  margin-bottom: 1.1rem;
}

.welcome_body_cjk {
  font-family:
    "Lato",
    "Hiragino Kaku Gothic ProN",
    "Noto Sans CJK JP",
    "PingFang SC",
    "PingFang TC",
    "Microsoft YaHei",
    sans-serif;
  line-height: 1.65;
}

.welcome_p {
  margin-bottom: 0.65rem;
  font-size: 0.95rem;

  &:last-child {
    margin-bottom: 0;
  }
}

.welcome_dismiss {
  width: 100%;
  padding: 0.65rem 1rem;
  border: none;
  border-radius: 0.5rem;
  background: #191919;
  color: #f2f2f2;
  font: inherit;
  font-size: 0.95rem;
  cursor: none !important;

  &:hover {
    opacity: 0.92;
  }
}

.welcome_translation_note {
  display: block;
  margin-top: 0.85rem;
  text-align: center;
  font-size: 0.78rem;
  line-height: 1.45;
  color: rgba(25, 25, 25, 0.62);
  text-decoration: underline;
  text-decoration-color: rgba(25, 25, 25, 0.35);
  text-underline-offset: 0.15em;
  cursor: none !important;

  &:hover {
    color: #191919;
    text-decoration-color: rgba(25, 25, 25, 0.55);
  }
}

.welcome_translation_note_cjk {
  font-family:
    "Hiragino Sans",
    "Hiragino Kaku Gothic ProN",
    "Noto Sans CJK JP",
    "PingFang SC",
    "PingFang TC",
    "Microsoft YaHei",
    sans-serif;
}
</style>
