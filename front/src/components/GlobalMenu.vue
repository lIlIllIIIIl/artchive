<script lang="ts" setup>
import { fetchAllArtists } from "@/composable/fetchData";
import { RouterLink, useRoute } from "vue-router";

const emit = defineEmits(["activatePopup", "disablePopup"]);

const route = useRoute();

const words = ref(["VueJS", "Animation", "Effet", "Hover"]);
const currentWord = ref<string>("");
const isRevealDone = ref<boolean>(false);
const displayText = ref<string>("");
const revealInterval = ref<any>(null);
const randomInterval = ref<any>(null);
const artistUrl = ref<string>("/artist?artist=");

function getRandomChar() {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789&é(§è!çà)-_°@#$*ù%=+/?";
  return chars[Math.floor(Math.random() * chars.length)];
}

function stopIntervals() {
  clearInterval(randomInterval.value);
  clearInterval(revealInterval.value);
}

function startRandomAnimation() {
  randomInterval.value = setInterval(() => {
    // Générer une longueur aléatoire entre 3 et 10
    const randomLength = Math.floor(Math.random() * 2) + 6;
    displayText.value = Array.from({ length: randomLength }, () =>
      getRandomChar(),
    ).join("");
  }, 80);
}

function startReveal() {
  stopIntervals();
  // Choisir un mot au hasard et l’assigner à currentWord

  currentWord.value =
    words.value[Math.floor(Math.random() * words.value.length)];
  let index = 0;
  isRevealDone.value = false;

  revealInterval.value = setInterval(() => {
    if (index < currentWord.value.length) {
      // Créer displayText avec la bonne longueur correspondant à currentWord
      displayText.value =
        currentWord.value.substring(0, index + 1) +
        Array.from({ length: currentWord.value.length - index - 1 }, () =>
          getRandomChar(),
        ).join("");
      index++;
      artistUrl.value = `/artist?artist=${displayText.value}`;
    } else {
      clearInterval(revealInterval.value);
      artistUrl.value = `/artist?artist=${currentWord.value}`;
      isRevealDone.value = true;
    }

    emit("activatePopup", `See ${displayText.value}'s artist page'`);
  }, 40);
}

function resetAnimation() {
  stopIntervals();
  startRandomAnimation();
  emit("disablePopup");
}

async function updateWords() {
  const artists = await fetchAllArtists();
  const currentArtist = route.query.artist as string | undefined;
  words.value = Array.isArray(artists)
    ? artists.map((a: { name: string }) => a.name).filter(
        (name: string) => name.toLocaleLowerCase() !== currentArtist?.toLowerCase(),
      )
    : [];
}

onMounted(async () => {
  startRandomAnimation();
  await updateWords();
});

watch(
  () => route.query.artist,
  async () => {
    await updateWords();
  },
);

onBeforeUnmount(() => {
  stopIntervals();
});
</script>

<template>
  <div class="global_menu">
    <RouterLink class="hoverable" to="/">Homepage</RouterLink>
    <RouterLink
      class="hoverable"
      @mouseenter="startReveal"
      @mouseleave="resetAnimation"
      :to="artistUrl"
      :tabindex="isRevealDone ? 0 : -1"
      :aria-disabled="!isRevealDone"
      @click.prevent="!isRevealDone"
    >
      {{ displayText }}
    </RouterLink>
  </div>
</template>

<style lang="scss">
.global_menu {
  // width: 100vw;
  display: flex;
  flex-direction: row;
  gap: 8px;
  margin: 2rem;

  .router-link-active {
    text-decoration: underline;
  }
}
span {
  font-family: monospace;
  transition: color 0.3s ease;
}
</style>
