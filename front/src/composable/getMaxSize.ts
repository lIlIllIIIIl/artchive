export default function getMaxSize(
  naturalWidth: number,
  naturalHeight: number,
  maxLen: number,
) {
  const ratio = naturalWidth / naturalHeight;
  let width = maxLen;
  let height = width / ratio;
  if (height > maxLen) {
    height = maxLen;
    width = height * ratio;
  }
  return { width, height };
}