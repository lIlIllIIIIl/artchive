<script setup lang="ts">
import { gsap } from "gsap";

onMounted(() => {
  const cursor = document.querySelector(".cursor") as HTMLElement;

  if (cursor) {
    document.addEventListener("mousemove", (event) => {
      const xPos = event.clientX;
      const yPos = event.clientY;
      cursor.style.left = xPos - 15 + "px";
      cursor.style.top = yPos - 15 + "px";
    });

    document.addEventListener("click", () => {
      const clickEvent = gsap.timeline();
      clickEvent
        .to(cursor, {
          scale: 3,
          duration: 0.2,
          ease: "power2.out",
        })
        .to(cursor, {
          scale: 1,
          duration: 0.2,
          ease: "power2.inOut",
        });
    });

    const hoverable = document.querySelectorAll(
      ".hoverable:not(.router-link-active)",
    );
    const mouseHover = gsap.to(cursor, {
      scale: 4,
      duration: 0.4,
      ease: "power1.inOut",
      paused: true,
    });
    hoverable.forEach((element) => {
      element.addEventListener("mouseenter", () => {
        mouseHover.play();
      });

      element.addEventListener("mouseleave", () => {
        mouseHover.reverse();
      });
    });

    //////////////////////////////
    ////////// Observer //////////
    //////////////////////////////
    const observer = new MutationObserver(() => {
      document
        .querySelectorAll(".hoverable:not(.router-link-active)")
        .forEach((hoverable) => {
          hoverable.addEventListener("mouseenter", () => {
            mouseHover.play();
          });
          hoverable.addEventListener("mouseleave", () => {
            mouseHover.reverse();
          });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }
});
</script>

<template>
  <div class="cursor" ref="cursor" />
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
