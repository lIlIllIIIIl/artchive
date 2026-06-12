<script setup lang="ts">
import { gsap } from 'gsap';

const enabled = ref(false);
let cleanup: (() => void) | null = null;

onMounted(() => {
  const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
  if (!mediaQuery.matches) {
    return;
  }

  enabled.value = true;

  nextTick(() => {
    const cursor = document.querySelector('.cursor') as HTMLElement | null;
    if (!cursor) {
      return;
    }

    const onMouseMove = (event: MouseEvent) => {
      cursor.style.left = `${event.clientX - 15}px`;
      cursor.style.top = `${event.clientY - 15}px`;
    };

    const onClick = () => {
      const clickEvent = gsap.timeline();
      clickEvent
        .to(cursor, {
          scale: 3,
          duration: 0.2,
          ease: 'power2.out',
        })
        .to(cursor, {
          scale: 1,
          duration: 0.2,
          ease: 'power2.inOut',
        });
    };

    const mouseHover = gsap.to(cursor, {
      scale: 4,
      duration: 0.4,
      ease: 'power1.inOut',
      paused: true,
    });

    const bindHoverables = () => {
      document
        .querySelectorAll('.hoverable:not(.router-link-active)')
        .forEach((element) => {
          element.addEventListener('mouseenter', () => {
            mouseHover.play();
          });
          element.addEventListener('mouseleave', () => {
            mouseHover.reverse();
          });
        });
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('click', onClick);
    bindHoverables();

    const observer = new MutationObserver(bindHoverables);
    observer.observe(document.body, { childList: true, subtree: true });

    cleanup = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('click', onClick);
      observer.disconnect();
    };
  });
});

onUnmounted(() => {
  cleanup?.();
});
</script>

<template>
  <div v-if="enabled" class="cursor" />
</template>

<style lang="scss">
.cursor {
  z-index: 10000;
  position: fixed;
  mix-blend-mode: difference;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  pointer-events: none;
  background: white;
  scale: 1;
}
</style>
