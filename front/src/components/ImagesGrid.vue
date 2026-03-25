<script setup lang="ts">
import { type ImageWithAuthor, fetchImagesWithAuthors } from '@/composable/fetchData'
import getEmptySequence from '@/composable/getEmptySequence'
import getMaxSize from '@/composable/getMaxSize'
import getRatio from '@/composable/getRatio'
import { gsap } from 'gsap'

const emit = defineEmits(['activatePopup', 'disablePopup', 'imagesLoaded'])

const props = withDefaults(
  defineProps<{
    artistData?: { artist: Array<{ id: string; name: string; twitter: string; instagram: string; shop: string }>; images: string[] }
  }>(),
  {},
)

const initImagesUrlArray = ref<ImageWithAuthor[]>([])
const displayedImage = ref(0)
const nbCols = ref(12)
const maxImageSizeInCols = ref(4)
const arrayViz = ref<string[][][]>([])
const yStart = ref(1)
const xStart = ref(1)
const deletedCol = ref(0)
const focusedImageIndex = ref<number | null>(null)
const containerRefs = ref<(HTMLElement | null)[]>([])
const IMAGES_PAGE_LIMIT = 20

const discoverHoverProgress = ref(0)
let discoverHoverInterval: ReturnType<typeof setInterval> | null = null
const DISCOVER_FILL_DURATION = 1500
const DISCOVER_TICK_MS = 16

function stopDiscoverFill() {
  if (discoverHoverInterval) {
    clearInterval(discoverHoverInterval)
    discoverHoverInterval = null
  }
  discoverHoverProgress.value = 0
}

function startDiscoverFill() {
  if (discoverHoverInterval) {
    return
  }
  discoverHoverProgress.value = 0
  const increment = (100 / DISCOVER_FILL_DURATION) * DISCOVER_TICK_MS
  discoverHoverInterval = setInterval(() => {
    discoverHoverProgress.value = Math.min(100, discoverHoverProgress.value + increment)
    if (discoverHoverProgress.value >= 100) {
      stopDiscoverFill()
      window.scrollTo(0, 0)
      window.location.reload()
    }
  }, DISCOVER_TICK_MS)
}

onMounted(async () => {
  try {
    const wrapper = document.querySelector('.wrapper') as HTMLElement
    wrapper.style.gridTemplateColumns = '1fr '.repeat(nbCols.value)
    if (!props.artistData) {
      const data = await fetchImagesWithAuthors(IMAGES_PAGE_LIMIT, [])
      initImagesUrlArray.value = data.images
      emit('imagesLoaded')
    } else {
      const author = props.artistData.artist?.[0] ?? null
      initImagesUrlArray.value = props.artistData.images.map((url) => ({
        id: '',
        url,
        author,
      }))
      emit('imagesLoaded')
    }
  } catch {
    throw new Error()
  }
})

onUnmounted(() => {
  stopDiscoverFill()
})

async function getSize(imageLoaded: HTMLImageElement) {
  const newRatio = getRatio(
    imageLoaded.clientWidth,
    imageLoaded.clientHeight,
    maxImageSizeInCols.value,
  )
  yStart.value = deletedCol.value + 1
  if (deletedCol.value >= 1) {
    xStart.value = arrayViz.value[0].findIndex((cell) => cell[0] !== 'x') + 1
  }
  if (arrayViz.value.length < yStart.value + newRatio.height - 1) {
    for (let row = 0; row < yStart.value + newRatio.height; row++) {
      const arrayRow: string[][] = []
      for (let col = 0; col < nbCols.value; col++) {
        arrayRow.push([])
      }
      arrayViz.value.push(arrayRow)
    }
  }
  const emptySequence = getEmptySequence(arrayViz.value[0], maxImageSizeInCols.value)
  xStart.value = emptySequence[0].start + 1
  if (newRatio.width > emptySequence[0].length) {
    const newWidth = emptySequence[0].length
    newRatio.height = Math.ceil((newWidth * newRatio.height) / newRatio.width)
    newRatio.width = newWidth
  }
  const container = imageLoaded.parentNode as HTMLElement
  const imageWidth = (window.innerWidth / nbCols.value) * newRatio.width
  const imageHeight = (imageWidth * newRatio.height) / newRatio.width
  container.style.gridArea = `${yStart.value} / ${xStart.value} / ${yStart.value + newRatio.height} / ${xStart.value + newRatio.width}`
  container.style.width = `${imageWidth}px`
  container.style.maxWidth = `${imageWidth}px`
  container.style.height = `${imageHeight}px`
  imageLoaded.style.width = `${imageWidth}px`
  imageLoaded.style.maxWidth = `${imageWidth}px`
  imageLoaded.style.height = `${imageHeight}px`
  if (xStart.value === 1) {
    imageLoaded.classList.add('start')
  }
  if (xStart.value + newRatio.width === nbCols.value + 1) {
    imageLoaded.classList.add('end')
  }
  await nextTick()
  for (let yCount = yStart.value - deletedCol.value; yCount < yStart.value - deletedCol.value + newRatio.height; yCount++) {
    for (let xCount = xStart.value; xCount < xStart.value + newRatio.width; xCount++) {
      arrayViz.value[yCount - 1][xCount - 1].push('x')
    }
  }
  xStart.value += newRatio.width
  displayedImage.value++
  let rowIdx = 0
  while (rowIdx < arrayViz.value.length) {
    if (arrayViz.value[rowIdx].every((cell) => cell[0] === 'x')) {
      arrayViz.value.splice(rowIdx, 1)
      deletedCol.value++
      xStart.value = 1
    } else {
      rowIdx++
    }
  }
}

async function wait(event: Event) {
  const image = event.target as HTMLImageElement
  await getSize(image)
  gsap.to(image.parentNode as HTMLElement, { opacity: 1, marginTop: '0px' })
}

function closeFocusedImage() {
  const idx = focusedImageIndex.value
  if (idx === null) {
    return
  }
  const containers = containerRefs.value
  const container = Array.isArray(containers) ? (containers[idx] ?? null) : null
  const image = container?.querySelector('img.image') as HTMLImageElement | null
  if (!container || !image) {
    focusedImageIndex.value = null
    emit('disablePopup')
    document.body.style.overflow = ''
    return
  }
  const rect = container.getBoundingClientRect()
  const mask = document.querySelector('.mask') as HTMLElement
  emit('disablePopup')
  focusedImageIndex.value = null
  const tl = gsap.timeline()
  tl.to(image, {
    duration: 0.5,
    top: rect.top + 'px',
    left: rect.left + 'px',
    width: rect.width,
    height: rect.height,
    maxWidth: rect.width,
    xPercent: 0,
    yPercent: 0,
    scale: 1,
    zIndex: 1,
  }).to(image, {
    clearProps: 'all',
    onComplete: () => {
      image.style.position = 'relative'
      image.style.width = rect.width + 'px'
      image.style.height = rect.height + 'px'
      image.style.maxWidth = rect.width + 'px'
      document.body.style.overflow = ''
    },
  })
  gsap.to(mask, { clearProps: 'all', duration: 0.4 })
}

function openImageAt(index: number) {
  const containers = containerRefs.value
  const container = Array.isArray(containers) ? (containers[index] ?? null) : null
  const image = container?.querySelector('img.image') as HTMLImageElement | null
  if (!container || !image) {
    return
  }
  const rect = container.getBoundingClientRect()
  const mask = document.querySelector('.mask') as HTMLElement
  const newSize = getMaxSize(
    image.clientWidth,
    image.clientHeight,
    (window.innerWidth / nbCols.value) * maxImageSizeInCols.value,
  )
  const item = initImagesUrlArray.value[index] as ImageWithAuthor | undefined
  const author = item?.author
  const link = author?.instagram || author?.shop || author?.twitter
  if (author && link) {
    emit(
      'activatePopup',
      `<a href="${link}" target="_blank" class="hoverable hoverable--underline">See ${author.name}'s work</a>`,
    )
  }
  document.body.style.overflow = 'hidden'
  gsap.set(image, { position: 'fixed', transformOrigin: 'center', top: rect.top, left: rect.left })
  gsap.to(image, {
    overflow: 'visible',
    top: '50%',
    left: '50%',
    width: newSize.width + 'px',
    height: newSize.height + 'px',
    maxWidth: newSize.width + 'px',
    xPercent: -50,
    yPercent: -50,
    scale: 2,
    zIndex: 20,
    duration: 0.2,
    ease: 'power1.out',
    onComplete: () => {
      focusedImageIndex.value = index
      gsap.set(mask, { zIndex: 10 })
    },
  })
}

async function focusImage(_event: MouseEvent, index: number) {
  if (focusedImageIndex.value !== null) {
    const previouslyFocused = focusedImageIndex.value
    closeFocusedImage()
    if (index !== previouslyFocused) {
      await new Promise((resolve) => setTimeout(resolve, 350))
      openImageAt(index)
    }
    return
  }
  openImageAt(index)
}
</script>

<template>
  <div>
    <div class="wrapper">
      <div
        class="mask"
        role="button"
        tabindex="0"
        @click="closeFocusedImage"
        @keydown.enter="closeFocusedImage"
      />

      <div
        v-for="(item, index) of initImagesUrlArray"
        :key="item.id || index"
        ref="containerRefs"
        class="img_container"
      >
        <img
          v-if="index <= displayedImage"
          :src="item.url"
          :alt="item.id || item.url"
          class="image"
          @load="wait($event)"
          @click="focusImage($event, index)"
        />
      </div>
    </div>

    <div
      v-if="!artistData"
      class="discover-section hoverable"
      role="button"
      tabindex="0"
      aria-label="Discover new artworks"
      @mouseenter="startDiscoverFill"
      @mouseleave="stopDiscoverFill"
      @keydown.enter.prevent="startDiscoverFill"
      @keydown.space.prevent="startDiscoverFill"
      @keyup.enter="stopDiscoverFill"
      @keyup.space="stopDiscoverFill"
    >
      <span class="discover-text">Discover new artworks</span>
      <svg
        class="discover-circle"
        viewBox="0 0 32 32"
        aria-hidden="true"
      >
        <circle
          class="discover-circle-bg"
          cx="16"
          cy="16"
          r="14"
          fill="none"
          stroke-width="2"
        />
        <circle
          class="discover-circle-fill"
          cx="16"
          cy="16"
          r="14"
          fill="none"
          stroke-width="2"
          stroke-dasharray="87.96"
          :stroke-dashoffset="87.96 - (87.96 * discoverHoverProgress) / 100"
        />
      </svg>
    </div>
  </div>
</template>

<style lang="scss">
* {
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.wrapper {
  position: relative;
  display: grid;
  width: 100%;
  gap: 0;

  .img_container {
    transition: all 1s;
    margin-top: 1000px;
    opacity: 0;

    img.image {
      position: relative;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      z-index: 1;
      transform-origin: center;

      transition: all 0.4s;

      &.start {
        transform-origin: center left;
      }

      &.end {
        transform-origin: center right;
      }

      &:hover {
        transform: scale(1.2);
        z-index: 10;
      }
    }
  }

  .mask {
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    z-index: -1;
    background: #000000;
    opacity: 0.9;
  }
}

.discover-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 3rem 0 4rem;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }

  .discover-text {
    font-size: 1rem;
    letter-spacing: 0.02em;
  }

  .discover-circle {
    width: 20px;
    height: 20px;
    transform: rotate(-90deg);

    .discover-circle-bg {
      stroke: currentColor;
      opacity: 0.3;
    }

    .discover-circle-fill {
      stroke: currentColor;
      transition: stroke-dashoffset 0.05s linear;
    }
  }
}
</style>
