<script setup lang="ts">
// <a target="_blank" href="https://icons8.com/icon/8824/twitter">Twitter</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
import ImagesGrid from "@/components/ImagesGrid.vue";

import { fetchArtist } from "@/composable/fetchData";
import { useRoute, onBeforeRouteUpdate } from "vue-router";

import type { ArtistData, Artist, ArtistLinks } from "@/types/main";

const emit = defineEmits(["activatePopup", "disablePopup", "imagesLoaded"]);

const route = useRoute();

const informations = ref<ArtistData>({
  artist: [],
  images: [],
});
const linksInformations = ref<ArtistLinks[]>([
  {
    twitter: "",
    instagram: "",
    shop: "",
  },
]);

onMounted(async () => {
  informations.value = await fetchArtist(route.query.artist as string);

  linksInformations.value = informations.value.artist.map(
    ({ id, name, ...rest }) => rest,
  );
});

onBeforeRouteUpdate(async (to, from, next) => {
  informations.value = await fetchArtist(to.query.artist as string);

  linksInformations.value = informations.value.artist.map(
    ({ id, name, ...rest }) => rest,
  );
  next();
});

function activatePopupArtist(key: string, data: string) {
  emit(
    "activatePopup",
    data
      ? `Click to see this artist's ${key}`
      : `This artist doesn't seem to have a ${key}`,
  );
}

function activatePopupImage(data: string) {
  emit("activatePopup", data);
}
</script>

<template>
  <div class="artist_informations-container" v-if="informations.artist">
    <h1 v-if="informations.artist[0]">{{ informations.artist[0].name }}</h1>

    <div v-for="(data, key) in linksInformations[0]" :key="key">
      <a
        class="artist_information-item_container hoverable"
        target="_blank"
        :href="data"
        @mouseenter="activatePopupArtist(key, data)"
        @mouseleave="$emit('disablePopup')"
      >
        <img class="artist_link-icon" :src="`src/assets/icons/${key}.svg`" />
      </a>
    </div>
  </div>

  <ImagesGrid
    v-if="informations.artist.length"
    :key="informations.artist[0]?.name"
    :artistData="informations"
    :displayPopup="false"
    @activatePopup="activatePopupImage"
    @disablePopup="$emit('disablePopup')"
    @imagesLoaded="$emit('imagesLoaded')"
  />
</template>

<style lang="scss">
.artist_informations-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 2rem;

  a.artist_information-item_container {
    display: flex;
    position: relative;

    .artist_link-icon {
      max-width: 2.2rem;
    }

    .link-text {
      font-size: 0.6rem;
      width: max-content;
      position: absolute;
      top: -1.4rem;
      left: -2rem;
      opacity: 0;
      transition: 0.4s ease;
    }

    &:hover {
      .link-text {
        display: block;
        opacity: 1;
      }
    }
  }
}
</style>
