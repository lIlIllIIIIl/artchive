export type WelcomeLocale = 'fr' | 'en' | 'es' | 'pt' | 'zh' | 'ja';

export type TranslationNoteLocale = Exclude<WelcomeLocale, 'fr' | 'en'>;

export type WelcomeCopyEntry = {
  title: string;
  paragraphs: string[];
  dismiss: string;
};

export const TRANSLATION_NOTE_LOCALES: TranslationNoteLocale[] = [
  'es',
  'pt',
  'zh',
  'ja',
];

export const TRANSLATION_NOTE: Record<TranslationNoteLocale, string> = {
  es: 'El español no es un idioma que practique; si el texto no es correcto, escríbeme en Twitter.',
  pt: 'O português não é uma língua que eu pratique; se o texto não estiver correto, escreva-me no Twitter.',
  zh: '中文并非我日常使用的语言；若译文不够准确，欢迎直接在 Twitter 上联系我。',
  ja: '日本語は得意な言語ではありません。表現に不自然な点があれば、Twitterで直接ご連絡ください。',
};

export const LOCALE_OPTIONS: { code: WelcomeLocale; label: string }[] = [
  { code: 'fr', label: 'FR' },
  { code: 'en', label: 'EN' },
  { code: 'es', label: 'ES' },
  { code: 'pt', label: 'PT' },
  { code: 'zh', label: '中文' },
  { code: 'ja', label: '日本語' },
];

export const COPY: Record<WelcomeLocale, WelcomeCopyEntry> = {
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
