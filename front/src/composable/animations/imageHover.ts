import { gsap } from 'gsap'

export function upImage(data: MouseEvent, focusedImage: Element | null) {

  // define html elements to animate
  const image = data.target as HTMLElement
  const container = image.parentNode as HTMLElement

  // if ratio is small enough, scale image bigger on hover
  const [ratio1, ratio2] = container.style.aspectRatio.split('/').map(Number);

  if(!focusedImage){

    gsap.set(container, {
      overflow: 'visible',
      zIndex: 50,
    });
    gsap.set(image, {
      zIndex: 50,
    })
    gsap.to(image, {
      // if ratio is small enough, scale image bigger on hover
      scale: ratio1 + ratio2 >= 5 ? '1.3' : '1.6',
      position: '',
      duration: .3,
    })
  }
}

export function downImage(data: MouseEvent, focusedImage: Element | null) {

  // define html elements to animate
  const image = data.target as HTMLElement
  const container = image.parentNode as HTMLElement

  if(!focusedImage) {
    gsap.set(container, {
      overflow: 'hidden',
      zIndex: 0,
    });
    gsap.to(image, {
      zIndex: 0,
      scale: 1,
      duration: .3,
    })
  }
}

export default {upImage, downImage}