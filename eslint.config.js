/**
 * Config ESLint à la racine du monorepo.
 * Le code linté (Vue / TS) vit dans `front/eslint.config.js`.
 * Ce fichier évite l’erreur « No ESLint configuration found » quand l’IDE
 * ou un outil résout la racine du workspace sans entrer dans `front/`.
 */
export default [
  {
    ignores: ["**/*"],
  },
];
