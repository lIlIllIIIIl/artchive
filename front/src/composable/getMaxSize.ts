export default function getMaxSize(
  nbCols: number,
  maxWidth: number,
  maxHeight: number,
) {

  const width = maxWidth - (window.innerWidth / nbCols);
  const height = maxHeight - (window.innerWidth / nbCols);
  return { width, height };
}
