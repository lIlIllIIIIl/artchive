// Version originale (pour référence)
export default function getRatio(width: number, height: number, max: number) {
  const ratio = Math.min(max / width, max / height);
  return {
    width: Math.round(width * ratio),
    height: Math.round(height * ratio),
  };
}

// Version modifiée pour gérer les contraintes de largeur spécifiques
export function getRatioWithWidthConstraint(
  width: number,
  height: number,
  maxWidth: number,
  maxHeight?: number
) {
  // Si pas de hauteur max spécifiée, utiliser la même que la largeur
  const heightLimit = maxHeight || maxWidth;

  // Calculer le ratio d'aspect de l'image
  const aspectRatio = height / width;

  // Ajuster selon la largeur disponible
  let newWidth = Math.min(width, maxWidth);
  let newHeight = Math.round(newWidth * aspectRatio);

  // Si la hauteur dépasse, ajuster selon la hauteur
  if (newHeight > heightLimit) {
    newHeight = heightLimit;
    newWidth = Math.round(newHeight / aspectRatio);
  }

  return {
    width: Math.max(1, newWidth), // S'assurer qu'on a au moins 1
    height: Math.max(1, newHeight)
  };
}

// Version pour votre cas d'usage spécifique
export function getRatioForGrid(
  originalWidth: number,
  originalHeight: number,
  availableColumns: number,
  maxColumns: number = 6
) {
  // Limiter à la largeur disponible et au maximum autorisé
  const constrainedWidth = Math.min(availableColumns, maxColumns);

  return getRatioWithWidthConstraint(
    originalWidth,
    originalHeight,
    constrainedWidth,
    maxColumns // Limite aussi la hauteur
  );
}