<script setup lang="ts">
import {
  COPY,
  LOCALE_OPTIONS,
  TRANSLATION_NOTE,
  TRANSLATION_NOTE_LOCALES,
  type TranslationNoteLocale,
  type WelcomeLocale,
} from './welcomeIntroCopy';

const SESSION_KEY = 'artchive_welcome_intro_seen';

const twitterProfileHref = 'https://x.com/Yoshik0_';

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

    .welcome_top {
      margin-bottom: 0.85rem;

      .welcome_lang {
        display: flex;
        flex-wrap: wrap;
        gap: 0.35rem;

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

          &.lang_btn_active {
            background: #191919;
            color: #f2f2f2;
            border-color: #191919;
          }
        }
      }
    }

    .welcome_title {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 0.75rem;
      line-height: 1.2;
    }

    .welcome_body {
      margin-bottom: 1.1rem;

      .welcome_p {
        margin-bottom: 0.65rem;
        font-size: 0.95rem;

        &:last-child {
          margin-bottom: 0;
        }
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
  }
}
</style>
