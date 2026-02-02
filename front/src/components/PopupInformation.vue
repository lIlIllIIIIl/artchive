<!-- PopupInformation.vue -->
<script setup lang="ts">
defineProps<{
  isActive: boolean,
  content: string
}>()
</script>

<template>
  <div :class="['popup_container', { active: isActive, inactive: !isActive }]" v-html="content"
  />
  <!-- {{ content ? content : 'Le portfolio de cet artiste est: https://alexis-kessab.com/' }} -->
  <!-- </div>
    {{ content }}
  </div> -->
</template>

<style lang="scss">
.popup_container {
  position: fixed;
  z-index: 1000;
  background: rgb(242, 242, 242);
  padding: 1rem;
  border-radius: 1rem;
  width: 300px;
  right: 0;
  transition: .4s ease;
  word-break: break-word;
  color: black;
  opacity: .9;

  &:hover {
    opacity: 1;
  }

  &.inactive {
      top: -20rem;
    }

    &.active {
        top: 2rem;
    }

    a {
        color: black;
        text-decoration: none;
        cursor: none !important;

    }

    .hoverable--underline:hover {
        text-decoration: underline;

    }
}
</style>
