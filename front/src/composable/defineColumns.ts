export default function getColumns(nbCols: number, maxImageSizeInCols: number, colSize: number, maxWidth: number) {
  const wrapper = document.querySelector('.wrapper') as HTMLElement

  // colSize = wrapper.clientWidth / nbCols
  // const colFinalSize = wrapper?.clientWidth / nbCols
  // maxWidth = colFinalSize * maxImageSizeInCols

  wrapper.style.gridTemplateColumns = '1fr '.repeat(nbCols)

  return {
    colSize,
    maxWidth,
  }

}